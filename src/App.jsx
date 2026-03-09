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

const API_URL = import.meta.env.VITE_API_URL;
function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [launchSource, setLaunchSource] = useState('landing'); // Track where we launched from
  const [currentView, setCurrentView] = useState('meetings');
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

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
        return <Insights meetings={meetings} />;
      case 'settings':
        return <Settings darkMode={darkMode} toggleTheme={toggleTheme} />;
      case 'profile':
        return <Profile />;
      case 'meetings':
      default:
        return (
          <div className="flex w-full h-full overflow-hidden">
            {/* Middle Panel - Meeting List */}
            <div className="w-[400px] flex-shrink-0 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <MeetingList
                meetings={meetings}
                selectedId={selectedMeetingId}
                onSelect={setSelectedMeetingId}
              />
            </div>

            {/* Right Panel - Meeting Details */}
            <div className="flex-1 h-full bg-white dark:bg-gray-900 relative">
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

  if (showLanding) {
    return <LandingPage
      onLaunch={() => { setLaunchSource('landing'); setShowLanding(false); }}
      onAbout={() => setShowInfo(true)}
      onGetSoftware={() => setShowAbout(true)}
      onFeatures={() => setShowFeatures(true)}
      onWatchDemo={() => setShowDemo(true)}
    />;
  }

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${darkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 relative z-20">
        <Sidebar
          activeView={currentView}
          onNavigate={setCurrentView}
          onNavigateBack={handleBackToSource}
          onNavigateHome={() => setShowLanding(true)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-gray-50 dark:bg-black">
        {renderContent()}
      </div>


    </div>
  );
}

export default App;
