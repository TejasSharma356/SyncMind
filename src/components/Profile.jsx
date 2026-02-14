import React from 'react';
import { User, Mail, Briefcase, MapPin } from 'lucide-react';

const Profile = () => {
    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50/50 dark:bg-black transition-colors duration-200">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <User className="text-gray-400" />
                    Profile
                </h1>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 text-center transition-colors">
                    <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-4 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
                        TS
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tejas Sharma</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Product Manager</p>

                    <div className="flex justify-center gap-4 mb-8">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors">Edit Profile</button>
                        <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Sign Out</button>
                    </div>

                    <div className="grid text-left max-w-md mx-auto gap-4">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg transition-colors">
                            <Mail size={18} />
                            <span className="text-sm">tejas.sharma@syncmind.app</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg transition-colors">
                            <Briefcase size={18} />
                            <span className="text-sm">Product & Engineering</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg transition-colors">
                            <MapPin size={18} />
                            <span className="text-sm">San Francisco, CA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
