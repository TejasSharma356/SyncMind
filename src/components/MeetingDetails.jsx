import React from 'react';
import { Calendar, Users, Share, MoreVertical } from 'lucide-react';
import AIInsightCard from './AIInsightCard';
import TranscriptChat from './TranscriptChat';

const MeetingDetails = ({ meeting }) => {
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex flex-wrap items-center gap-3">
                        <span className="line-clamp-2">{meeting.title || meeting.summary || "Untitled Meeting"}</span>
                        <span className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                            AI PROCESSED
                        </span>
                    </h1>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{new Date(meeting.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
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
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* Transcript */}
                {meeting.transcript && (
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            Transcript
                        </h2>
                        <TranscriptChat transcript={meeting.transcript} />
                    </section>
                )}

                {/* Key Points */}
                {meeting.key_points && meeting.key_points.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            Key Points
                        </h2>
                        <ul className="space-y-3">
                            {meeting.key_points.map((point, index) => (
                                <li key={index} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Insights */}
                {meeting.insights && meeting.insights.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            Insights
                        </h2>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <ul className="space-y-4">
                                {meeting.insights.map((insight, index) => (
                                    <li key={index} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                                        <span className="text-yellow-500 mt-0.5 flex-shrink-0">
                                            <Lightbulb size={16} />
                                        </span>
                                        <span className="leading-relaxed">{insight.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* Action Items */}
                {meeting.action_items && meeting.action_items.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            Action Items
                        </h2>
                        <div className="grid gap-3">
                            {meeting.action_items.map((item, index) => (
                                <div key={index} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 flex justify-between items-center group hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.task}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-gray-400" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.owner}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
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
