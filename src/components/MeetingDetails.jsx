import React, { useState } from 'react';
import { Calendar, Users, Share, MoreVertical, Lightbulb, Check, ArrowLeft } from 'lucide-react';
import AIInsightCard from './AIInsightCard';
import TranscriptChat from './TranscriptChat';
import html2pdf from 'html2pdf.js';
import { FileText, FileDown } from 'lucide-react';

const MeetingDetails = ({ meeting, standalone = false, onBack }) => {
    const [completedTasks, setCompletedTasks] = useState(new Set());
    // --- EXPORT TO MARKDOWN ---
    const handleMarkdownExport = () => {
        let text = `# ${meeting.title || meeting.summary || "Untitled Meeting"}\n\n`;
        text += `**Date:** ${new Date(meeting.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}\n\n`;
        
        if (meeting.summary) {
            text += `## Summary\n${meeting.summary}\n\n`;
        }
        
        if (meeting.key_points && meeting.key_points.length > 0) {
            text += `## Key Points\n`;
            meeting.key_points.forEach(point => {
                text += `- ${point}\n`;
            });
            text += `\n`;
        }

        if (meeting.action_items && meeting.action_items.length > 0) {
            text += `## Action Items\n`;
            meeting.action_items.forEach(item => {
                text += `- [ ] **${item.task}** (Assigned to: ${item.owner})\n`;
            });
            text += `\n`;
        }

        if (meeting.insights && meeting.insights.length > 0) {
            text += `## Insights\n`;
            meeting.insights.forEach(insight => {
                text += `- ${insight.text || insight}\n`;
            });
            text += `\n`;
        }

        if (meeting.transcript && meeting.transcript.length > 0) {
            text += `## Transcript\n`;
            meeting.transcript.forEach(line => {
                text += `**${line.speaker}:** ${line.text}\n\n`;
            });
        }

        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "meeting-summary.md";
        link.click();
    };

    // --- EXPORT TO PDF ---
    const handlePdfExport = () => {
        const headerElem = document.getElementById('pdf-only-header');
        if (headerElem) {
            headerElem.style.display = 'block';
        }

        const element = document.getElementById('meeting-content-to-export');

        // This tells the PDF tool to format it nicely like a standard piece of paper
        const opt = {
            margin: 0.5,
            filename: 'meeting-summary.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            if (headerElem) {
                headerElem.style.display = 'none';
            }
        });
    };
    const toggleTask = (index) => {
        setCompletedTasks(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };
    if (!meeting) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
                <p className="text-gray-400">Select a meeting to view details</p>
            </div>
        );
    }

    return (
        <div className="flex-1 h-full bg-transparent flex flex-col relative transition-colors duration-200">
            {/* Header */}
            <div className={`px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start sticky top-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg z-10 transition-colors ${standalone ? 'w-full' : ''}`}>
                <div className="flex items-start gap-4">
                    {standalone && (
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            title="Go back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    )}
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
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleMarkdownExport}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        <FileText size={16} />
                        Export MD
                    </button>

                    <button
                        onClick={handlePdfExport}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        <FileDown size={16} />
                        Export PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                        <Share size={16} />
                        Share
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div
                id="meeting-content-to-export"
                className={`flex-1 overflow-y-auto p-8 space-y-10 ${standalone ? 'w-full scrollbar-hide' : ''}`}>
                
                {/* PDF Only Header */}
                <div id="pdf-only-header" style={{ display: 'none' }} className="mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {meeting.title || meeting.summary || "Untitled Meeting"}
                    </h1>
                    <p className="text-gray-500">
                        {new Date(meeting.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                </div>

                {/* Transcript */}
                {meeting.transcript && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            Transcript
                        </h2>
                        <TranscriptChat transcript={meeting.transcript} />
                    </section>
                )}

                {/* Key Points */}
                {meeting.key_points && meeting.key_points.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            Key Points
                        </h2>
                        <ul className="space-y-4">
                            {meeting.key_points.map((point, index) => (
                                <li key={index} className="flex gap-4 text-base lg:text-lg text-gray-700 dark:text-gray-300">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Insights */}
                {meeting.insights && meeting.insights.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            Insights
                        </h2>
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm w-fit max-w-full">
                            <ul className="space-y-6">
                                {meeting.insights.map((insight, index) => (
                                    <li key={index} className="flex gap-4 text-base lg:text-lg text-gray-700 dark:text-gray-300">
                                        <span className="text-yellow-500 mt-1 flex-shrink-0">
                                            <Lightbulb size={20} />
                                        </span>
                                        <span className="leading-relaxed">{insight.text || insight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* Action Items */}
                {meeting.action_items && meeting.action_items.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            Action Items
                        </h2>
                        <div className="grid gap-4 w-fit max-w-full">
                            {meeting.action_items.map((item, index) => {
                                const isCompleted = completedTasks.has(index);
                                return (
                                    <button
                                        key={index}
                                        onClick={() => toggleTask(index)}
                                        className={`w-fit max-w-full text-left p-6 rounded-2xl border transition-all flex flex-col sm:flex-row gap-8 sm:justify-between sm:items-center group
                                            ${isCompleted
                                                ? 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/10'
                                                : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-start sm:items-center gap-4">
                                            <div className={`w-6 h-6 rounded flex items-center justify-center border flex-shrink-0 transition-colors mt-0.5 sm:mt-0
                                                ${isCompleted
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-500 text-transparent'
                                                }`}>
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                            <span className={`text-base lg:text-lg font-medium transition-colors ${isCompleted
                                                ? 'text-gray-400 dark:text-gray-500 line-through'
                                                : 'text-gray-900 dark:text-gray-100'
                                                }`}>{item.task}</span>
                                        </div>
                                        <div className="flex items-center gap-2 pl-10 sm:pl-0">
                                            <Users size={18} className={isCompleted ? 'text-gray-400' : 'text-blue-500'} />
                                            <span className={`text-sm font-medium ${isCompleted ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>{item.owner}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>


        </div>
    );
};

export default MeetingDetails;
