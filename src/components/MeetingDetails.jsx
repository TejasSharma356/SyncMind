import React from 'react';
import { Calendar, Users, Share, MoreVertical } from 'lucide-react';
import AIInsightCard from './AIInsightCard';

const MeetingDetails = ({ meeting, transcript }) => {
    if (!meeting) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
                <p className="text-gray-400">Select a meeting to view details</p>
            </div>
        );
    }

    return (
        <div className="flex-1 h-full bg-white dark:bg-gray-900 flex flex-col relative transition-colors duration-200">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-10 transition-colors">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        {meeting.title}
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                            {meeting.category}
                        </span>
                    </h1>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{meeting.date} • {meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-gray-400" />
                            <span>{meeting.participants} Participants</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                        <Share size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {transcript.map((item, index) => {
                    if (item.type === 'insight') {
                        return (
                            <div key={index} className="pl-12">
                                <AIInsightCard content={item.content} />
                            </div>
                        );
                    }

                    return (
                        <div key={item.id} className="flex gap-4 group">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${item.initial === 'S' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                                item.initial === 'D' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                    'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                }`}>
                                {item.initial}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{item.speaker}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl bg-white dark:bg-gray-900 transition-colors">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Status */}
            <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center text-[10px] text-gray-400 font-medium transition-colors">
                <button className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    {/* Download icon could go here */}
                    Export as PDF
                </button>
                <span>Auto-saved at 10:45 AM</span>
            </div>
        </div>
    );
};

export default MeetingDetails;
