import React from 'react';

export default function TaskCard({ tasks }) {
    if (!tasks || tasks.length === 0) return null;

    return (
        <div className="bg-surface border border-white/5 rounded-xl p-5 shadow-lg auto-rows-max">
            <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Tasks
            </h2>
            <div className="space-y-3">
                {tasks.map((task, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                            <span className="font-medium text-text text-sm">{task.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${task.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                {task.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted mt-1">
                            <span>👤 {task.owner}</span>
                            <span>📅 {task.deadline}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
