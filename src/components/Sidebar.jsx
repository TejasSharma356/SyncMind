import React from 'react';
import { LayoutGrid, Lightbulb, Settings, User, Video, ArrowLeft } from 'lucide-react';

const Sidebar = ({ activeView, onNavigate, onNavigateBack, onNavigateHome }) => {
    const menuItems = [
        { id: 'meetings', icon: Video, label: 'Meetings' },
        { id: 'insights', icon: Lightbulb, label: 'Insights' },
        { id: 'settings', icon: Settings, label: 'Settings' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between p-6 fixed left-0 top-0 transition-colors duration-200">
            <div>
                <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={onNavigateHome}>
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <div className="w-1 h-3 bg-white mx-0.5 rounded-full"></div>
                        <div className="w-1 h-5 bg-white mx-0.5 rounded-full"></div>
                        <div className="w-1 h-2 bg-white mx-0.5 rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white text-lg leading-tight">SyncMInd</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Productivity Mode</span>
                    </div>
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

            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
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
