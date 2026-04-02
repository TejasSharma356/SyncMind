import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Smartphone, MonitorSmartphone, User, CreditCard, Link2, CheckCircle2, AlertCircle } from 'lucide-react';

const Settings = ({ darkMode, toggleTheme }) => {
    const [desktopConnected, setDesktopConnected] = useState(true);

    return (
        <div className="flex-1 w-full h-full overflow-y-auto bg-transparent transition-colors duration-200">
            <div className="w-full max-w-[100rem] mx-auto px-12 py-20 flex flex-col gap-12">

                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-4">
                    <SettingsIcon className="text-gray-400 dark:text-gray-500" size={40} />
                    Settings
                </h1>

                <div className="grid 2xl:grid-cols-2 gap-10">
                    {/* Left Column */}
                    <div className="flex flex-col gap-6">

                        {/* Appearance / Display */}
                        <div className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 overflow-hidden">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Theme Preferences</h3>
                                    <p className="text-base text-gray-500 dark:text-gray-400">Customize the look and feel of your dashboard</p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl">
                                    <button
                                        onClick={() => !darkMode && toggleTheme()}
                                        className={`px-6 py-3 rounded-lg text-base font-medium transition-all ${!darkMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                                    >
                                        Light
                                    </button>
                                    <button
                                        onClick={() => darkMode && toggleTheme()}
                                        className={`px-6 py-3 rounded-lg text-base font-medium transition-all ${darkMode ? 'bg-gray-700 shadow-sm text-white' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Dark
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Desktop App Connectivity */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                    <MonitorSmartphone size={28} />
                                </div>
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Desktop App Connection</h2>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 mb-6">
                                <div className="flex items-center gap-4">
                                    {desktopConnected ? (
                                        <CheckCircle2 className="text-emerald-500" size={28} />
                                    ) : (
                                        <AlertCircle className="text-amber-500" size={28} />
                                    )}
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white text-base">Status</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{desktopConnected ? 'Connected via SyncMInd Desktop App' : 'Waiting for connection...'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDesktopConnected(!desktopConnected)}
                                    className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    {desktopConnected ? 'Disconnect' : 'Connect'}
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Auto-upload Recordings</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Automatically sync meetings to dashboard</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Launch on Startup</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Start desktop app when Windows boots</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 line-clamp-2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                                    <Bell size={28} />
                                </div>
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between cursor-pointer">
                                    <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">Meeting processed alarms</h3>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 cursor-pointer" />
                                </div>
                                <div className="flex items-center justify-between cursor-pointer">
                                    <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">Action items reminder</h3>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 cursor-pointer" />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">

                        {/* Account & Billing */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 overflow-hidden">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6">Account</h2>

                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                    <User size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sarah Jenkins</h3>
                                    <p className="text-base text-gray-500 dark:text-gray-400">sarah@example.com</p>
                                </div>
                                <button className="ml-auto px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    Edit Profile
                                </button>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <CreditCard size={20} className="text-gray-400 dark:text-gray-500" />
                                    <h3 className="font-medium text-gray-900 dark:text-white text-base">Subscription Plan</h3>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-base text-gray-500 dark:text-gray-400">Pro Plan (Billed Annually)</p>
                                    <button className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline">Manage Billing</button>
                                </div>
                            </div>
                        </div>

                        {/* Privacy & Security */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                                    <Shield size={28} />
                                </div>
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Privacy & Security</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">End-to-End Encryption</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">All recordings are encrypted locally</p>
                                    </div>
                                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm px-3 py-1.5 rounded-lg font-medium">Enabled</span>
                                </div>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Data Retention</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Automatic deletion schedule</p>
                                    </div>
                                    <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-base rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 min-w-[120px]">
                                        <option>Forever</option>
                                        <option>90 days</option>
                                        <option>30 days</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Integrations */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                        <Link2 size={28} />
                                    </div>
                                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Integrations</h2>
                                </div>
                                <button className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline">View All</button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-600 text-lg font-bold">G</div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Google Calendar</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Sync meeting titles automatically</p>
                                        </div>
                                    </div>
                                    <button className="text-sm font-medium px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Connect</button>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-600 text-lg font-bold">S</div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Slack</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Push action items to channels</p>
                                        </div>
                                    </div>
                                    <button className="text-sm font-medium px-4 py-2 border border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">Connected</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
