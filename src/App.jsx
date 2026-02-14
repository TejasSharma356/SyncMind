import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MeetingList from './components/MeetingList';
import MeetingDetails from './components/MeetingDetails';
import Insights from './components/Insights';
import Settings from './components/Settings';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import { meetings, transcriptData } from './data/mockData';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState('meetings');
  const [selectedMeetingId, setSelectedMeetingId] = useState(1);

  // Derive the selected meeting and its transcript
  const selectedMeeting = meetings.find(m => m.id === selectedMeetingId);
  const selectedTranscriptItems = transcriptData[selectedMeetingId] || [];

  const [darkMode, setDarkMode] = useState(false);

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
        return <Insights />;
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
                meeting={selectedMeeting}
                transcript={selectedTranscriptItems}
              />
            </div>
          </div>
        );
    }
  };

  if (showLanding) {
    return <LandingPage onLaunch={() => setShowLanding(false)} />;
  }

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${darkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 relative z-20">
        <Sidebar activeView={currentView} onNavigate={setCurrentView} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-gray-50 dark:bg-black">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
