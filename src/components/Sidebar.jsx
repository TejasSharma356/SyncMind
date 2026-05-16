import React from 'react';
import { LayoutGrid, Lightbulb, Settings, User, Video, ArrowLeft } from 'lucide-react';

const Sidebar = ({ activeView, onNavigate, onNavigateBack, onNavigateHome, onClose }) => {
    const menuItems = [
        { id: 'meetings', icon: Video, label: 'Meetings' },
        { id: 'insights', icon: Lightbulb, label: 'Insights' },
        { id: 'settings', icon: Settings, label: 'Settings' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="w-64 h-screen bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between p-6 transition-colors duration-200">
            <div>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <div className="w-1 h-3 bg-white mx-0.5 rounded-full"></div>
                            <div className="w-1 h-5 bg-white mx-0.5 rounded-full"></div>
                            <div className="w-1 h-2 bg-white mx-0.5 rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-white text-lg leading-tight">SyncMind</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Productivity Mode</span>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    <button 
                        onClick={onClose}
                        className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeView === item.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-auto pt-4">
                <button
                    onClick={onNavigateBack}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
            </div>

        </div >
    );
};

export default Sidebar;
