import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

const Insights = () => {
    const insights = [
        {
            id: 1,
            date: "Oct 12",
            title: "Integration Module Concerns",
            content: "David highlighted potential delays due to legacy endpoint rate-limiting. Historical data suggests a 15% increase in QA time.",
            action: "Review queuing microservice docs"
        },
        {
            id: 2,
            date: "Oct 10",
            title: "Design System Updates",
            content: "Team agreed to adopt the new typography scale. Mobile mockups need to be updated by Friday.",
            action: "Update Figma library"
        },
        {
            id: 3,
            date: "Oct 08",
            title: "Budget Adjustment",
            content: "Apollo launch budget increased by 10% to cover additional marketing spend.",
            action: "Update Q4 Budget Sheet"
        }
    ];

    return (
        <div className="h-full overflow-y-auto bg-gray-50/50 dark:bg-black transition-colors duration-200">
            <div className="w-full max-w-4xl ml-auto mr-12 px-6 py-12 flex flex-col gap-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                    <Lightbulb className="text-yellow-500" />
                    Insights & Recommendations
                </h1>

                <div className="flex flex-col gap-6">
                    {insights.map((insight) => (
                        <div key={insight.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{insight.title}</h3>
                                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{insight.date}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{insight.content}</p>

                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm cursor-pointer hover:underline">
                                <span>Action: {insight.action}</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Insights;
