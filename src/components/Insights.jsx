import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

const Insights = ({ meetings = [] }) => {
    const meetingsWithInsights = meetings.filter(m => m.insights && m.insights.length > 0);

    return (
        <div className="flex-1 w-full h-full overflow-y-auto bg-gray-50/50 dark:bg-black transition-colors duration-200">
            <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                    <Lightbulb className="text-yellow-500" />
                    Insights & Recommendations
                </h1>

                {meetingsWithInsights.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400 p-8 text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                        No insights found in recent meetings.
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {meetingsWithInsights.map((meeting) => (
                            <div key={meeting.meetingId} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                        {meeting.summary || "Untitled Meeting"}
                                    </h3>
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-shrink-0">
                                        {new Date(meeting.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>

                                <ul className="space-y-3 mb-6">
                                    {meeting.insights.map((insight, idx) => (
                                        <li key={idx} className="flex gap-3 text-gray-600 dark:text-gray-300">
                                            <span className="text-yellow-500 mt-1 flex-shrink-0">
                                                <Lightbulb size={16} />
                                            </span>
                                            <p className="leading-relaxed">{insight.text}</p>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm cursor-pointer hover:underline">
                                    <span>View meeting details</span>
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Insights;
