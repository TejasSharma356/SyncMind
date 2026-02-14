import React from 'react';
import { Bot, Copy, CheckSquare } from 'lucide-react';

const AIInsightCard = ({ content }) => {
    return (
        <div className="bg-[#eff6ff] dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/50 my-6 transition-colors">
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-500 p-1.5 rounded-lg text-white shadow-sm">
                    <Bot size={16} />
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">AI Silent Teammate</span>
                <span className="text-[10px] text-blue-500 dark:text-blue-400 font-bold uppercase tracking-wider ml-1">Insight</span>
            </div>

            <p className="text-[13px] text-gray-800 dark:text-gray-200 italic leading-relaxed mb-4 font-medium">
                {content}
            </p>

            <div className="flex gap-2">
                <button
                    onClick={() => alert("Added to Action Items!")}
                    className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
                >
                    <CheckSquare size={14} />
                    Add to Action Items
                </button>
                <button
                    onClick={() => { navigator.clipboard.writeText(content); alert("Insight Copied to Clipboard!"); }}
                    className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
                >
                    <Copy size={14} />
                    Copy Insight
                </button>
            </div>
        </div>
    );
};

export default AIInsightCard;
