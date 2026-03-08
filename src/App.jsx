import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MeetingList from './components/MeetingList';
import MeetingDetails from './components/MeetingDetails';
import Insights from './components/Insights';
import Settings from './components/Settings';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';

// import { meetings, transcriptData } from './data/mockData';

const API_ENDPOINT = "https://05lgwo27oj.execute-api.us-east-1.amazonaws.com/default/SyncMind";
function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState('meetings');
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  // Derive the selected meeting
  const selectedMeeting = meetings.find(m => m.meetingId === selectedMeetingId) || null;

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch(API_ENDPOINT);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

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
                meeting={selectedMeeting}
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
