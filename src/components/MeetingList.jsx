import React from 'react';
import { Search } from 'lucide-react';

const MeetingList = ({ meetings, selectedId, onSelect }) => {
    return (
        <div className="w-full h-full bg-white dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <div className="p-6 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Meetings</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search past meetings..."
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {meetings.map((meeting) => (
                    <div
                        key={meeting.id}
                        onClick={() => onSelect(meeting.id)}
                        className={`cursor-pointer p-5 border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 group relative ${selectedId === meeting.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                            }`}
                    >
                        {selectedId === meeting.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>
                        )}

                        <div className="flex justify-between items-start mb-1">
                            <h3 className={`font-semibold text-sm leading-tight pr-6 ${selectedId === meeting.id ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'
                                }`}>
                                {meeting.title}
                            </h3>
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex-shrink-0">
                                {meeting.date.split(" ").slice(0, 2).join(" ").toUpperCase()}
                            </span>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
                            {meeting.snippet}
                        </p>

                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-medium rounded-md">
                                {meeting.duration}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-medium rounded-md">
                                {meeting.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingList;
