import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MeetingList from './components/MeetingList';
import MeetingDetails from './components/MeetingDetails';
import Insights from './components/Insights';
import Settings from './components/Settings';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import ProjectInfoPage from './components/ProjectInfoPage';
import FeaturesPage from './components/FeaturesPage';
import DemoPage from './components/DemoPage';
import PricingPage from './components/PricingPage';
import Aurora from './components/Aurora';

const API_URL = import.meta.env.VITE_API_URL;
function App() {
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Derive the selected meeting
  const selectedMeeting = meetings.find(m => m.meetingId === selectedMeetingId) || null;

  useEffect(() => {
    const fetchMeetings = async () => {
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
        console.error("Failed to fetch meetings", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
    const interval = setInterval(fetchMeetings, 5000);
    return () => clearInterval(interval);
  }, []); // Remove selectedMeetingId from dep array to avoid re-selecting on every poll unless empty


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
      case 'meeting_detail':
        return (
          <div className="w-full h-full">
            <MeetingDetails
              key={selectedMeeting?.meetingId || 'empty'}
              meeting={selectedMeeting}
              standalone={true}
              onBack={() => {
                setCurrentView(previousView || 'meetings');
                setPreviousView(null);
              }}
            />
          </div>
        );
      case 'settings':
        return <Settings darkMode={darkMode} toggleTheme={toggleTheme} />;
      case 'profile':
        return <Profile />;
      case 'meetings':
      default:
        return (
          <div className="flex w-full h-full overflow-hidden">
            {/* Middle Panel - Meeting List */}
            <div className="w-[400px] flex-shrink-0 h-full border-r border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/40 backdrop-blur-md">
              <MeetingList
                meetings={meetings}
                selectedId={selectedMeetingId}
                onSelect={setSelectedMeetingId}
              />
            </div>

            {/* Right Panel - Meeting Details */}
            <div className="flex-1 h-full bg-transparent relative">
              <MeetingDetails
                key={selectedMeeting?.meetingId || 'empty'}
                meeting={selectedMeeting}
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
    <div className={`flex h-screen font-sans overflow-hidden ${darkMode ? 'dark' : ''}`}>
      <Aurora
        colorStops={["#cf66ff", "#70aef0", "#e50649"]}
        blend={0.5}
        amplitude={1.0}
        speed={1.0}
      />
      {/* Left Sidebar */}
      <div className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsSidebarOpen(false)} />
      <div className={`fixed md:relative w-64 flex-shrink-0 z-40 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar
          activeView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            setIsSidebarOpen(false); // Close sidebar on mobile after navigation
          }}
          onNavigateBack={handleBackToSource}
          onNavigateHome={() => {
            setShowLanding(true);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center p-4 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
          </button>
          <span className="ml-4 font-bold text-gray-900 dark:text-white">SyncMind</span>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {renderContent()}
        </div>
      </div>


    </div>
  );
}

export default App;
