import React from 'react';
import { User, Mail, Briefcase, MapPin, Building2, Clock, Globe, Laptop, Smartphone, Activity, CalendarDays } from 'lucide-react';

const Profile = () => {
    return (
        <div className="flex-1 w-full h-full overflow-y-auto bg-transparent transition-colors duration-200">
            <div className="w-full max-w-[100rem] mx-auto px-6 py-10 md:px-12 md:py-20 flex flex-col gap-8 md:gap-12">

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 md:mb-6 flex items-center gap-4">
                    <User className="text-gray-400 dark:text-gray-500" size={32} md:size={40} />
                    Profile
                </h1>

                {/* Top Profile Card */}
                <div className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 md:p-12 transition-colors flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-10">
                    <div className="w-24 h-24 md:w-40 md:h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl md:text-5xl font-bold border-4 border-white dark:border-gray-800 shadow-xl shrink-0">
                        TS
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-1 md:mb-3">Tejas Sharma</h2>
                        <p className="text-lg md:text-2xl text-gray-500 dark:text-gray-400 mb-4 md:mb-6">Product Manager</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 md:px-5 md:py-3 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                <Mail size={18} className="text-gray-400" />
                                <span className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px] sm:max-w-md" title="tejas.sharma@syncmind.app">tejas.sharma@syncmind.app</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 md:px-5 md:py-3 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                <MapPin size={18} className="text-gray-400" />
                                <span className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">San Francisco, CA</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 md:px-5 md:py-3 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                <Briefcase size={18} className="text-gray-400" />
                                <span className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">Product & Engineering</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-auto mt-2 md:mt-0">
                        <button className="px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white rounded-2xl text-base md:text-lg font-medium shadow-sm hover:bg-blue-700 transition-colors w-full">
                            Edit Profile
                        </button>
                        <button className="px-6 py-3 md:px-8 md:py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl text-base md:text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Additional Options Grid */}
                <div className="grid 2xl:grid-cols-2 gap-10">

                    {/* Professional Details Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 flex items-center gap-3">
                            <Building2 className="text-blue-500" size={24} md:size={28} /> Professional Details
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
                                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                    <User size={24} />
                                    <span className="text-lg font-medium">Employee ID</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">EMP-2048</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
                                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                    <CalendarDays size={24} />
                                    <span className="text-lg font-medium">Join Date</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">January 15, 2024</span>
                            </div>
                            <div className="flex items-center justify-between pb-2">
                                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                    <Building2 size={24} />
                                    <span className="text-lg font-medium">Office</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">HQ - Floor 4, Suite 402</span>
                            </div>
                        </div>
                    </div>

                    {/* Preferences & Settings */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 flex items-center gap-3">
                            <Globe className="text-emerald-500" size={24} md:size={28} /> Regional Preferences
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
                                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                    <Globe size={24} />
                                    <span className="text-lg font-medium">Language</span>
                                </div>
                                <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-base rounded-xl block p-3 min-w-[160px] font-medium">
                                    <option>English (US)</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                </select>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6 gap-4 sm:gap-0">
                                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                    <Clock size={24} />
                                    <span className="text-lg font-medium">Timezone</span>
                                </div>
                                <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-base rounded-xl block p-3 w-full sm:min-w-[220px] sm:w-auto font-medium">
                                    <option>(GMT-08:00) Pacific Time</option>
                                    <option>(GMT-05:00) Eastern Time</option>
                                    <option>(GMT+00:00) London</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between pb-2">
                                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                    <CalendarDays size={24} />
                                    <span className="text-lg font-medium">Date Format</span>
                                </div>
                                <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-base rounded-xl block p-3 min-w-[160px] font-medium">
                                    <option>MM/DD/YYYY</option>
                                    <option>DD/MM/YYYY</option>
                                    <option>YYYY-MM-DD</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Recent Security Activity */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm 2xl:col-span-2">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 flex items-center gap-3">
                            <Activity className="text-amber-500" size={24} md:size={28} /> Recent Login Activity
                        </h3>

                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-800/50 gap-4">
                                <div className="flex items-center gap-3 md:gap-5">
                                    <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <Laptop size={24} md:size={28} className="text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Windows 11 PC</h4>
                                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">San Francisco, CA • Chrome</p>
                                    </div>
                                </div>
                                <div className="sm:text-right w-full sm:w-auto">
                                    <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs md:text-sm font-semibold rounded-lg">Active Now</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 border border-gray-100 dark:border-gray-800 rounded-2xl gap-4">
                                <div className="flex items-center gap-3 md:gap-5">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <Smartphone size={24} md:size={28} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">iPhone 14 Pro</h4>
                                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">San Jose, CA • SyncMind App</p>
                                    </div>
                                </div>
                                <div className="sm:text-right w-full sm:w-auto">
                                    <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">Yesterday</p>
                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">10:42 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Profile;
