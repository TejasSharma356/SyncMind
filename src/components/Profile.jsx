import React, { useState, useEffect, useCallback } from 'react';
import { User, Mail, Briefcase, MapPin, Building2, Clock, Globe, Laptop, Smartphone, Activity, CalendarDays, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = ({ setCurrentView }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    // Initial state loading dynamically or blank
    const [profileData, setProfileData] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        title: '',
        location: '',
        department: '',
        phone: '',
        bio: '',
    });

    // Fetch custom profile details from the AWS Cloud database on load
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user || !API_URL) return;
            setIsLoading(true);
            try {
                const token = await user.getIdToken();
                const response = await fetch(`${API_URL}?action=getProfile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.profile) {
                        setProfileData(prev => ({
                            ...prev,
                            ...data.profile,
                            name: data.profile.name || prev.name || user?.displayName || '',
                            email: data.profile.email || prev.email || user?.email || '',
                        }));
                    }
                }
            } catch (err) {
                console.warn("Failed to fetch cloud profile:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user, API_URL]);

    // Update profile data when Firebase user changes (only if fields are currently empty)
    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                name: !prev.name && user.displayName ? user.displayName : prev.name,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle Profile Save In-Place to Cloud DB
    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setShowSuccessBanner(false);

        try {
            console.log('Saving profile dynamically to AWS database:', profileData);
            
            if (!API_URL || !user) {
                throw new Error("Server API connection is currently offline.");
            }

            const token = await user.getIdToken();
            const response = await fetch(`${API_URL}?action=saveProfile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    profile: {
                        ...profileData,
                        profileCompleted: 'true'
                    }
                })
            });

            if (!response.ok) {
                throw new Error("Failed to save profile to the cloud database.");
            }

            // Show premium success banner
            setShowSuccessBanner(true);
            
            // Auto fade banner after 5 seconds
            setTimeout(() => {
                setShowSuccessBanner(false);
            }, 5000);

            console.log('Profile saved successfully to AWS Cloud database!');
        } catch (err) {
            const errorMsg = err.message || 'Failed to save profile';
            console.error('Error saving profile:', err);
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 w-full h-full overflow-y-auto bg-transparent transition-colors duration-200">
            <div className="w-full max-w-[100rem] mx-auto px-12 py-20 flex flex-col gap-10">

                {/* Back to Settings Header Link */}
                <button
                    onClick={() => setCurrentView && setCurrentView('settings')}
                    className="w-fit flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group mb-2"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back to Settings
                </button>

                {/* Success Notification Banner */}
                {showSuccessBanner && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
                        <CheckCircle2 size={22} className="shrink-0" />
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Success!</span>
                            <span className="text-xs opacity-90">Your professional profile settings have been successfully updated and synced with the cloud.</span>
                        </div>
                        <button
                            onClick={() => setShowSuccessBanner(false)}
                            className="ml-auto text-emerald-700 dark:text-emerald-400 hover:opacity-70 font-semibold"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Error Banner */}
                {error && (
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-2xl text-red-700 dark:text-red-400 flex items-center gap-3">
                        <span className="text-sm font-semibold">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-700 dark:text-red-400 hover:text-red-900 font-bold"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-4">
                            <User className="text-gray-400 dark:text-gray-500" size={40} />
                            Professional Profile
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base">Customize and update your professional metadata and regional preferences.</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="flex flex-col gap-10">

                    {/* Top Profile Card with editable fields */}
                    <div className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={profileData.name} className="w-36 h-36 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl shrink-0" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="w-36 h-36 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-5xl font-bold border-4 border-white dark:border-gray-800 shadow-xl shrink-0 uppercase">
                                {(profileData.name || user?.email || 'U').charAt(0)}
                            </div>
                        )}

                        <div className="flex-1 w-full grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Tejas Sharma"
                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl px-5 py-3.5 text-base focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={profileData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Product Manager"
                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl px-5 py-3.5 text-base focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid lg:grid-cols-2 gap-10">

                        {/* Professional Metadata Card */}
                        <div className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl p-10 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                <Building2 className="text-blue-500" size={26} /> Professional Details
                            </h3>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        disabled
                                        className="w-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl px-5 py-3.5 text-base cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleChange}
                                        placeholder="e.g. +1 (555) 000-0000"
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl px-5 py-3.5 text-base focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">Office Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={profileData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. San Francisco, CA"
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl px-5 py-3.5 text-base focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={profileData.department}
                                        onChange={handleChange}
                                        placeholder="e.g. Product & Engineering"
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl px-5 py-3.5 text-base focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preferences & Bio Card */}
                        <div className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl p-10 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                <Globe className="text-emerald-500" size={26} /> Preferences & Bio
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">Short Biography</label>
                                <textarea
                                    name="bio"
                                    value={profileData.bio || ''}
                                    onChange={handleChange}
                                    placeholder="Write a brief professional summary about yourself..."
                                    rows="4"
                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl px-5 py-3.5 text-base focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">Language</label>
                                    <select className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl px-5 py-3.5 text-base focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer font-medium">
                                        <option>English (US)</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">Timezone</label>
                                    <select className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl px-5 py-3.5 text-base focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer font-medium">
                                        <option>(GMT-08:00) Pacific Time</option>
                                        <option>(GMT-05:00) Eastern Time</option>
                                        <option>(GMT+00:00) London</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Submit Row */}
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-lg font-semibold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                        >
                            {isLoading ? 'Saving Changes...' : 'Save Profile Settings'}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default Profile;
