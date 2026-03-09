import React from 'react';

export default function RiskCard({ risks }) {
    if (!risks || risks.length === 0) return null;

    return (
        <div className="bg-surface border border-red-500/10 rounded-xl p-5 shadow-lg">
            <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Risks
            </h2>
            <div className="space-y-3">
                {risks.map((risk, i) => (
                    <div key={i} className="p-3 bg-red-500/5 rounded-lg border border-red-500/10 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-red-100">{risk.description}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${risk.severity === 'High' ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'}`}>
                                {risk.severity}
                            </span>
                        </div>
                        <div className="text-xs text-muted">
                            Relation: <span className="text-text/80">{risk.relatedTask}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
