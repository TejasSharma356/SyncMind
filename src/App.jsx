import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MeetingList from './components/MeetingList';
import MeetingDetails from './components/MeetingDetails';
import Insights from './components/Insights';
import AnalyticsPage from './components/AnalyticsPage';
import Settings from './components/Settings';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import ProjectInfoPage from './components/ProjectInfoPage';
import FeaturesPage from './components/FeaturesPage';
import DemoPage from './components/DemoPage';
import PricingPage from './components/PricingPage';
import Aurora from './components/Aurora';
import ErrorBoundary from './components/ErrorBoundary';
import { mockMeetings } from './data/mockMeetings';
import { logout, isFirebaseInitialized, getFirebaseError } from './firebase';

const API_URL = import.meta.env.VITE_API_URL;
const FIREBASE_ERROR = getFirebaseError();

function App() {
  // Log Firebase status on app load
  useEffect(() => {
    const fbInitialized = isFirebaseInitialized();
    if (!fbInitialized) {
      console.warn('[App] Firebase is not initialized. Running in demo mode with mock data only.');
    } else {
      console.log('[App] Firebase initialized successfully');
    }
  }, []);
  const [showLanding, setShowLanding] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [launchSource, setLaunchSource] = useState('landing'); // Track where we launched from
  const [currentView, setCurrentView] = useState('meetings');
  const [previousView, setPreviousView] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [, setIsLoading] = useState(true);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  // Derive the selected meeting
  const selectedMeeting = meetings.find(m => m.meetingId === selectedMeetingId) || null;

  useEffect(() => {
    let isMockMode = false;
    let interval;

    const loadMockMeetings = () => {
      isMockMode = true; // Mark as mock mode
      if (interval) clearInterval(interval); // Clear the polling loop so edits persist

      const sortedMockData = [...mockMeetings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMeetings(sortedMockData);
      setSelectedMeetingId(prev => {
        if (!prev && sortedMockData.length > 0) {
          return sortedMockData[0].meetingId;
        }
        return prev;
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
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        // Sort by newest first
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setMeetings(sortedData);
        // Automatically select the first meeting on initial load if none selected
        setSelectedMeetingId(prev => {
          if (!prev && sortedData.length > 0) {
            return sortedData[0].meetingId;
          }
          return prev;
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
  }, []); // Remove selectedMeetingId from dep array to avoid re-selecting on every poll unless empty


  const handleDeleteMeeting = (meetingId) => {
    const updatedMeetings = meetings.filter(m => m.meetingId !== meetingId);
    setMeetings(updatedMeetings);
    if (selectedMeetingId === meetingId) {
      setSelectedMeetingId(updatedMeetings.length > 0 ? updatedMeetings[0].meetingId : null);
    }
    // If we're in standalone mode, go back
    if (currentView === 'meeting_detail') {
      setCurrentView(previousView || 'meetings');
      setPreviousView(null);
    }
  };

  const handleUpdateMeeting = (updatedMeeting) => {
    const updatedMeetings = meetings.map(m => 
      m.meetingId === updatedMeeting.meetingId ? updatedMeeting : m
    );
    setMeetings(updatedMeetings);
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
          <div className="w-full h-full print:h-auto print:block">
            <MeetingDetails
              key={selectedMeeting?.meetingId || 'empty'}
              meeting={selectedMeeting}
              standalone={true}
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
        return <Settings darkMode={darkMode} toggleTheme={toggleTheme} />;
      case 'profile':
        return (
          <Profile
            onLogout={logout}
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
              />
            </div>

            {/* Right Panel - Meeting Details */}
            <div className="flex-1 h-full bg-transparent relative print:h-auto print:overflow-visible">
              <MeetingDetails
                key={selectedMeeting?.meetingId || 'empty'}
                meeting={selectedMeeting}
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

  if (showLanding) {
    return <LandingPage
      onLaunch={() => { setLaunchSource('landing'); setShowLanding(false); }}
      onAbout={() => setShowInfo(true)}
      onGetSoftware={() => setShowAbout(true)}
      onFeatures={() => setShowFeatures(true)}
      onWatchDemo={() => setShowDemo(true)}
      onPricing={() => setShowPricing(true)}
    />;
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
