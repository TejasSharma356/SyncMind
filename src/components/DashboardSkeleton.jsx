import React from 'react';

const DashboardSkeleton = () => {
    return (
        <div className="flex h-screen w-screen bg-black text-gray-100 font-sans overflow-hidden select-none">
            {/* Sidebar Skeleton */}
            <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white/5 dark:bg-gray-950/20 backdrop-blur-md flex flex-col p-6 gap-6">
                {/* Brand Header */}
                <div className="flex items-center gap-3 pb-6 border-b border-gray-200/10">
                    <div className="w-10 h-10 animate-shimmer rounded-xl"></div>
                    <div className="h-6 animate-shimmer rounded-md w-28"></div>
                </div>

                {/* Sidebar Navigation Links */}
                <div className="flex-1 flex flex-col gap-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-3 py-2">
                            <div className="w-5 h-5 animate-shimmer rounded-md shrink-0"></div>
                            <div className="h-4 animate-shimmer rounded-md w-24"></div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Bottom Profile/Settings */}
                <div className="pt-6 border-t border-gray-200/10 flex items-center gap-3">
                    <div className="w-10 h-10 animate-shimmer rounded-full"></div>
                    <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-3.5 animate-shimmer rounded-md w-20"></div>
                        <div className="h-3 animate-shimmer rounded-md w-24"></div>
                    </div>
                </div>
            </div>

            {/* Main Content Area Skeleton */}
            <div className="flex-1 flex overflow-hidden">
                {/* Middle Panel - Meeting List Skeleton */}
                <div className="w-[400px] flex-shrink-0 h-full border-r border-gray-200 dark:border-gray-800 bg-white/5 dark:bg-gray-900/10 backdrop-blur-sm flex flex-col">
                    <div className="p-6 pb-4">
                        <div className="h-8 animate-shimmer rounded-md w-32 mb-4"></div>
                        <div className="h-10 animate-shimmer rounded-lg w-full"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="p-5 border-b border-gray-100 dark:border-gray-850 flex flex-col gap-3">
                                <div className="h-4.5 animate-shimmer rounded-md w-3/4"></div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-3.5 animate-shimmer rounded-md w-16"></div>
                                    <div className="h-3.5 animate-shimmer rounded-md w-20"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel - Meeting Details Skeleton */}
                <div className="flex-1 h-full bg-transparent flex flex-col p-10 overflow-y-auto gap-8">
                    {/* Header Skeleton */}
                    <div className="flex flex-col gap-3 border-b border-gray-200/10 pb-6">
                        <div className="h-9 animate-shimmer rounded-md w-1/2"></div>
                        <div className="h-4 animate-shimmer rounded-md w-48"></div>
                    </div>

                    {/* Grid Skeleton */}
                    <div className="grid lg:grid-cols-2 gap-8 flex-1">
                        {/* Summary Skeleton */}
                        <div className="bg-white/5 dark:bg-gray-900/20 rounded-2xl p-8 border border-gray-200/5 dark:border-gray-800/40 flex flex-col gap-4">
                            <div className="h-5 animate-shimmer rounded-md w-32 mb-2"></div>
                            <div className="h-4 animate-shimmer rounded-md w-full"></div>
                            <div className="h-4 animate-shimmer rounded-md w-11/12"></div>
                            <div className="h-4 animate-shimmer rounded-md w-5/6"></div>
                            <div className="h-4 animate-shimmer rounded-md w-2/3"></div>
                        </div>

                        {/* Key Insights Skeleton */}
                        <div className="bg-white/5 dark:bg-gray-900/20 rounded-2xl p-8 border border-gray-200/5 dark:border-gray-800/40 flex flex-col gap-4">
                            <div className="h-5 animate-shimmer rounded-md w-36 mb-2"></div>
                            <div className="h-4 animate-shimmer rounded-md w-full"></div>
                            <div className="h-4 animate-shimmer rounded-md w-11/12"></div>
                            <div className="h-4 animate-shimmer rounded-md w-3/4"></div>
                        </div>

                        {/* Action Items Skeleton */}
                        <div className="bg-white/5 dark:bg-gray-900/20 rounded-2xl p-8 border border-gray-200/5 dark:border-gray-800/40 flex flex-col gap-4 lg:col-span-2">
                            <div className="h-5 animate-shimmer rounded-md w-40 mb-2"></div>
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-5 h-5 animate-shimmer rounded-md shrink-0"></div>
                                    <div className="h-4 animate-shimmer rounded-md w-1/3"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
