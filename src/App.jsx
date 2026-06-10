import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MeetingList from './components/MeetingList';
import MeetingDetails from './components/MeetingDetails';
import Insights from './components/Insights';
import AnalyticsPage from './components/AnalyticsPage';
import Settings from './components/Settings';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import AboutPage from './components/AboutPage';
import ProjectInfoPage from './components/ProjectInfoPage';
import FeaturesPage from './components/FeaturesPage';
import DemoPage from './components/DemoPage';
import PricingPage from './components/PricingPage';
import Aurora from './components/Aurora';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardSkeleton from './components/DashboardSkeleton';
import RecordFirstMeetingPopup from './components/RecordFirstMeetingPopup';
import { mockMeetings } from './data/mockMeetings';
import { CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;
const LOCAL_CHANGES_KEY = 'syncmind:meeting-changes';
const LOCAL_DELETES_KEY = 'syncmind:deleted-meetings';

const sortMeetings = (items = []) => (
  [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
);

const readLocalJson = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn(`Unable to read ${key} from localStorage.`, error);
    return fallback;
  }
};

const writeLocalJson = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to write ${key} to localStorage.`, error);
  }
};

const getLocalMeetingChanges = () => readLocalJson(LOCAL_CHANGES_KEY, {});
const getLocalDeletedMeetingIds = () => new Set(readLocalJson(LOCAL_DELETES_KEY, []));

const persistLocalMeetingChange = (meeting) => {
  const changes = getLocalMeetingChanges();
  changes[meeting.meetingId] = meeting;
  writeLocalJson(LOCAL_CHANGES_KEY, changes);
};

const persistLocalMeetingDelete = (meetingId) => {
  const deletedIds = getLocalDeletedMeetingIds();
  deletedIds.add(meetingId);
  writeLocalJson(LOCAL_DELETES_KEY, [...deletedIds]);

  const changes = getLocalMeetingChanges();
  delete changes[meetingId];
  writeLocalJson(LOCAL_CHANGES_KEY, changes);
};

const applyLocalMeetingState = (items = []) => {
  const changes = getLocalMeetingChanges();
  const deletedIds = getLocalDeletedMeetingIds();

  return sortMeetings(
    items
      .filter((meeting) => !deletedIds.has(meeting.meetingId))
      .map((meeting) => changes[meeting.meetingId] || meeting)
  );
};

const getMeetingApiUrl = (meetingId) => {
  if (!API_URL) return null;
  return `${API_URL.replace(/\/$/, '')}/${encodeURIComponent(meetingId)}`;
};

const selectExistingMeetingId = (currentId, items = []) => {
  if (currentId && items.some(meeting => meeting.meetingId === currentId)) {
    return currentId;
  }
  return items[0]?.meetingId || null;
};

function App() {
  const { user, loading } = useAuth();
  


  // Clear persistent dashboard routing states when logged out to avoid carrying over view state
  useEffect(() => {
    if (!user && !loading) {
      sessionStorage.removeItem('syncmind_current_view');
      sessionStorage.removeItem('syncmind_selected_meeting_id');
      sessionStorage.removeItem('syncmind_previous_view');
      
      sessionStorage.setItem('syncmind_show_landing', 'true');
      sessionStorage.setItem('syncmind_show_login', 'false');
      sessionStorage.setItem('syncmind_show_about', 'false');
      sessionStorage.setItem('syncmind_show_info', 'false');
      sessionStorage.setItem('syncmind_show_features', 'false');
      sessionStorage.setItem('syncmind_show_demo', 'false');
      sessionStorage.setItem('syncmind_show_pricing', 'false');
    }
  }, [user, loading]);



  // Log Firebase status on app load
  useEffect(() => {
    const fbInitialized = isFirebaseInitialized();
    if (!fbInitialized) {
      console.warn('[App] Firebase is not initialized. Running in demo mode with mock data only.');
    } else {
      console.log('[App] Firebase initialized successfully');
    }
  }, []);
  const [showLanding, setShowLanding] = useState(() => {
    return sessionStorage.getItem('syncmind_show_landing') !== 'false';
  });
  const [showLogin, setShowLogin] = useState(() => {
    return sessionStorage.getItem('syncmind_show_login') === 'true';
  });
  const [showAbout, setShowAbout] = useState(() => {
    return sessionStorage.getItem('syncmind_show_about') === 'true';
  });
  const [showInfo, setShowInfo] = useState(() => {
    return sessionStorage.getItem('syncmind_show_info') === 'true';
  });
  const [showFeatures, setShowFeatures] = useState(() => {
    return sessionStorage.getItem('syncmind_show_features') === 'true';
  });
  const [showDemo, setShowDemo] = useState(() => {
    return sessionStorage.getItem('syncmind_show_demo') === 'true';
  });
  const [showPricing, setShowPricing] = useState(() => {
    return sessionStorage.getItem('syncmind_show_pricing') === 'true';
  });
  const [launchSource, setLaunchSource] = useState(() => {
    return sessionStorage.getItem('syncmind_launch_source') || 'landing';
  });

  useEffect(() => {
    // Check if we came from Electron app
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('source') === 'desktop') {
      setShowLanding(false);
      setShowLogin(true);
    }
  }, []);

  // Heartbeat polling to capture Electron login requests in-place if website is already open
  useEffect(() => {
    if (!showLogin) return;

    let timeoutId;
    let currentInterval = 2000;
    const maxInterval = 30000;

    const pollElectronServer = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5185/heartbeat');
        if (response.ok) {
          const data = await response.json();
          currentInterval = 2000; // Reset to fast polling on success
          if (data.loginRequested) {
            console.log('[HEARTBEAT] Login requested by local Electron client!');
            // Reset all other subviews
            setShowLanding(false);
            setShowAbout(false);
            setShowInfo(false);
            setShowFeatures(false);
            setShowDemo(false);
            setShowPricing(false);
            
            // Activate Login View
            setShowLogin(true);
            
            // Inject query param source=desktop
            const url = new URL(window.location.href);
            url.searchParams.set('source', 'desktop');
            window.history.replaceState({}, document.title, url.toString());
          }
        } else {
          // If response not ok, treat as failure and back off
          currentInterval = Math.min(currentInterval * 1.5, maxInterval);
        }
      } catch (err) {
        // Local desktop client server offline - back off exponentially
        currentInterval = Math.min(currentInterval * 2, maxInterval);
      }

      // Schedule next poll only if tab is visible, otherwise poll very slowly
      const nextDelay = document.visibilityState === 'visible' ? currentInterval : maxInterval;
      timeoutId = setTimeout(pollElectronServer, nextDelay);
    };

    // Listen for visibility change to trigger a fast check when user returns
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(timeoutId);
        currentInterval = 2000; // Reset to fast polling
        pollElectronServer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start the loop
    timeoutId = setTimeout(pollElectronServer, 1000);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [showLogin]);
  const [currentView, setCurrentView] = useState(() => {
    return sessionStorage.getItem('syncmind_current_view') || 'meetings';
  });
  const [previousView, setPreviousView] = useState(() => {
    return sessionStorage.getItem('syncmind_previous_view') || null;
  });
  const [meetings, setMeetings] = useState([]);
  const [, setIsLoading] = useState(true);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [globalToastMessage, setGlobalToastMessage] = useState(null);

  // Derive the selected meeting
  const selectedMeeting = meetings.find(m => m.meetingId === selectedMeetingId) || null;

  const showGlobalToast = (message) => {
    setGlobalToastMessage(message);
    setTimeout(() => setGlobalToastMessage(null), 3000);
  };

  useEffect(() => {
    let isMockMode = false;
    let interval;

    const loadMockMeetings = () => {
      isMockMode = true; // Mark as mock mode
      if (interval) clearInterval(interval); // Clear the polling loop so edits persist

      const sortedMockData = applyLocalMeetingState(mockMeetings);
      setMeetings(sortedMockData);
      setSelectedMeetingId(prev => {
        return selectExistingMeetingId(prev, sortedMockData);
      });
    };

    const fetchMeetings = async () => {
      if (isMockMode) return; // Stop fetching if we've fallen back to mock data
      if (!API_URL) {
        loadMockMeetings();
        setIsLoading(false);
        return;
      }

      try {
        let headers = {};
        if (user && !user.isDemo) {
            const token = await user.getIdToken();
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(API_URL, { headers });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        const sortedData = applyLocalMeetingState(data);

        // Default mock walkthrough meeting for new users with 0 records
        if (sortedData.length === 0 && mockMeetings.length > 0) {
          sortedData.push(mockMeetings[0]);
        }

        setMeetings(sortedData);
        // Automatically select the first meeting on initial load if none selected
        setSelectedMeetingId(prev => {
          return selectExistingMeetingId(prev, sortedData);
        });
      } catch (err) {
        console.warn("Failed to fetch meetings. Using mock data for local testing.", err);
        loadMockMeetings();
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
    interval = setInterval(fetchMeetings, 5000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]); // Add user to dependency array so it refetches when login state changes


  const handleDeleteMeeting = async (meetingId) => {
    const previousMeetings = meetings;
    const updatedMeetings = previousMeetings.filter(m => m.meetingId !== meetingId);
    setMeetings(updatedMeetings);
    if (selectedMeetingId === meetingId) {
      setSelectedMeetingId(updatedMeetings.length > 0 ? updatedMeetings[0].meetingId : null);
    }
    // If we're in standalone mode, go back
    if (currentView === 'meeting_detail') {
      setCurrentView(previousView || 'meetings');
      setPreviousView(null);
    }
    persistLocalMeetingDelete(meetingId);

    try {
      const endpoint = getMeetingApiUrl(meetingId);
      if (endpoint) {
        const response = await fetch(endpoint, { method: 'DELETE' });
        if (!response.ok) throw new Error('Delete request failed');
      }
      const result = {
        ok: true,
        localOnly: !API_URL,
        message: API_URL ? 'Meeting deleted.' : 'Meeting deleted locally.',
      };
      showGlobalToast(result.message);
      return result;
    } catch (error) {
      console.warn('Delete failed in API mode. Persisting a local delete fallback.', error);
      const result = {
        ok: true,
        localOnly: true,
        message: 'Meeting deleted locally. Backend delete is unavailable.',
      };
      showGlobalToast(result.message);
      return result;
    }
  };

  const handleUpdateMeeting = async (updatedMeeting) => {
    const previousMeetings = meetings;
    const updatedMeetings = previousMeetings.map(m =>
      m.meetingId === updatedMeeting.meetingId ? updatedMeeting : m
    );
    setMeetings(updatedMeetings);
    persistLocalMeetingChange(updatedMeeting);

    try {
      const endpoint = getMeetingApiUrl(updatedMeeting.meetingId);
      let savedMeeting = updatedMeeting;

      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedMeeting),
        });
        if (!response.ok) throw new Error('Update request failed');

        const responseText = await response.text();
        savedMeeting = responseText ? JSON.parse(responseText) : updatedMeeting;
        if (!savedMeeting.meetingId) savedMeeting = updatedMeeting;
        setMeetings(currentMeetings => currentMeetings.map(m =>
          m.meetingId === savedMeeting.meetingId ? savedMeeting : m
        ));
      }

      persistLocalMeetingChange(savedMeeting);
      return {
        ok: true,
        localOnly: !API_URL,
        meeting: savedMeeting,
        message: API_URL ? 'Meeting updated.' : 'Meeting updated locally.',
      };
    } catch (error) {
      persistLocalMeetingChange(updatedMeeting);
      console.warn('Update failed in API mode. Persisting a local fallback.', error);
      return {
        ok: true,
        localOnly: true,
        meeting: updatedMeeting,
        message: 'Meeting saved locally. Backend update is unavailable.',
      };
    }
  };

  const [darkMode, setDarkMode] = useState(true);


  // Toggle Dark Mode
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const renderContent = () => {
    switch (currentView) {
      case 'insights':
        return <Insights 
          meetings={meetings} 
          isLoading={isLoading}
          onViewDetails={(meetingId) => {
            setPreviousView('insights');
            setSelectedMeetingId(meetingId);
            setCurrentView('meeting_detail');
          }}
        />;
      case 'analytics':
        return <AnalyticsPage meetings={meetings} darkMode={darkMode} />;
      case 'meeting_detail':
        return (
          <div className="w-full h-full overflow-hidden print:h-auto print:block">
            <MeetingDetails
              key={selectedMeeting?.meetingId || 'empty'}
              meeting={selectedMeeting}
              standalone={true}
              isLoading={isLoading}
              onBack={() => {
                setCurrentView(previousView || 'meetings');
                setPreviousView(null);
              }}
              onDelete={handleDeleteMeeting}
              onUpdate={handleUpdateMeeting}
            />
          </div>
        );
      case 'settings':
        return <Settings darkMode={darkMode} toggleTheme={toggleTheme} setCurrentView={setCurrentView} onLogout={logout} />;
      case 'profile':
        return (
          <Profile
            setCurrentView={setCurrentView}
          />
        );
      case 'meetings':
      default:
        return (
          <div className="flex w-full h-full overflow-hidden print:overflow-visible print:block">
            {/* Middle Panel - Meeting List */}
            <div className="w-[400px] flex-shrink-0 h-full border-r border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/40 backdrop-blur-md print:hidden">
              <MeetingList
                meetings={meetings}
                selectedId={selectedMeetingId}
                onSelect={setSelectedMeetingId}
                isLoading={isLoading}
              />
            </div>

            {/* Right Panel - Meeting Details */}
            <div className="flex-1 h-full overflow-hidden bg-transparent relative print:h-auto print:overflow-visible">
              <MeetingDetails
                key={selectedMeeting?.meetingId || 'empty'}
                meeting={selectedMeeting}
                isLoading={isLoading}
                onDelete={handleDeleteMeeting}
                onUpdate={handleUpdateMeeting}
              />
            </div>
          </div>
        );
    }
  };

  const handleBackToSource = () => {
    switch (launchSource) {
      case 'about':
        setShowAbout(true);
        break;
      case 'info':
        setShowInfo(true);
        break;
      case 'features':
        setShowFeatures(true);
        break;
      case 'demo':
        setShowDemo(true);
        break;
      case 'pricing':
        setShowPricing(true);
        break;
      case 'landing':
      default:
        setShowLanding(true);
        break;
    }
  };

  if (showLogin) {
    return <LoginPage
      onSuccess={() => { setShowLogin(false); setShowLanding(false); setCurrentView('meetings'); }}
      onBack={() => { setShowLogin(false); setShowLanding(true); }}
    />;
  }

  if (showInfo) {
    return <ProjectInfoPage
      onBack={() => { setShowInfo(false); setShowLanding(true); }}
      onGetSoftware={() => { setShowInfo(false); setShowAbout(true); }}
      onLaunch={() => { setLaunchSource('info'); setShowInfo(false); setShowLanding(false); }}
    />;
  }

  if (showAbout) {
    return <AboutPage
      onBack={() => { setShowAbout(false); setShowLanding(true); }}
      onLaunch={() => { setLaunchSource('about'); setShowAbout(false); setShowLanding(false); }}
    />;
  }

  if (showFeatures) {
    return <FeaturesPage
      onBack={() => { setShowFeatures(false); setShowLanding(true); }}
      onGetSoftware={() => { setShowFeatures(false); setShowAbout(true); }}
      onLaunch={() => { setLaunchSource('features'); setShowFeatures(false); setShowLanding(false); }}
    />;
  }

  if (showDemo) {
    return <DemoPage
      onBack={() => { setShowDemo(false); setShowLanding(true); }}
      onLaunch={() => { setLaunchSource('demo'); setShowDemo(false); setShowLanding(false); }}
    />;
  }

  if (showPricing) {
    return <PricingPage
      onBack={() => { setShowPricing(false); setShowLanding(true); }}
      onLaunch={() => { setLaunchSource('pricing'); setShowPricing(false); setShowLanding(false); }}
    />;
  }

  if (showLanding || (!user && !loading)) {
    return <LandingPage
      onLaunch={() => {
        setShowLanding(false);
        if (user) {
          setShowLogin(false);
        } else {
          setShowLogin(true);
        }
      }}
      onAbout={() => setShowInfo(true)}
      onGetSoftware={() => setShowAbout(true)}
      onFeatures={() => setShowFeatures(true)}
      onWatchDemo={() => setShowDemo(true)}
      onPricing={() => setShowPricing(true)}
    />;
  }
  
  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className={`flex h-screen font-sans overflow-hidden print:h-auto print:overflow-visible print:bg-white print:text-black ${darkMode ? 'dark' : ''}`}>
      {/* Firebase Error Banner */}
      {FIREBASE_ERROR && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-900/80 border-b border-yellow-600 backdrop-blur-sm p-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-yellow-100 text-sm">
            <span>⚠️ Firebase not initialized. Running in demo mode with mock data. Check .env configuration.</span>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-white text-xs font-medium transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      )}
      
      <div className="print:hidden">
        <Aurora
          colorStops={["#cf66ff", "#70aef0", "#e50649"]}
          blend={0.5}
          amplitude={1.0}
          speed={1.0}
        />
      </div>
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 relative z-20 print:hidden">
        <Sidebar
          activeView={currentView}
          onNavigate={setCurrentView}
          onNavigateBack={handleBackToSource}
          onNavigateHome={() => setShowLanding(true)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden print:overflow-visible">
        {renderContent()}
      </div>

      {globalToastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 print:hidden">
          <CheckCircle2 size={18} className="text-emerald-400 dark:text-emerald-600" />
          <span className="text-sm font-medium">{globalToastMessage}</span>
        </div>
      )}


      {/* Pop-up urging new users to record their first meeting */}
      <RecordFirstMeetingPopup
        isOpen={showFirstMeetPopup}
        onClose={() => {
          localStorage.setItem('syncmind_first_meet_popup_closed', 'true');
          setShowFirstMeetPopup(false);
        }}
        onGetSoftware={() => {
          localStorage.setItem('syncmind_first_meet_popup_closed', 'true');
          setShowFirstMeetPopup(false);
          setShowAbout(true); // Route back to Get Software (About) page!
        }}
      />
    </div>
  );
}

export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

