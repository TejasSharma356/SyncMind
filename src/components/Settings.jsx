import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Smartphone } from 'lucide-react';

const Settings = ({ darkMode, toggleTheme }) => {
    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50/50 dark:bg-black">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <SettingsIcon className="text-gray-400" />
                    Settings
                </h1>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Appearance</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Customize the look and feel</p>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                            <button
                                onClick={() => !darkMode && toggleTheme()}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${!darkMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                Light
                            </button>
                            <button
                                onClick={() => darkMode && toggleTheme()}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${darkMode ? 'bg-gray-700 shadow-sm text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Dark
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage how you receive alerts</p>
                            </div>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 font-medium text-sm">Edit</button>
                    </div>

                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Privacy & Security</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Control your data and active sessions</p>
                            </div>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 font-medium text-sm">Edit</button>
                    </div>

                    <div className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                                <Smartphone size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">App Integrations</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Connected calendar and productivity apps</p>
                            </div>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 font-medium text-sm">Manage</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
