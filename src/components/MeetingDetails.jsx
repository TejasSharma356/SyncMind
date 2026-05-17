import React, { useState, useEffect, useRef } from 'react';
import { 
    Calendar, 
    Users, 
    Share, 
    MoreVertical, 
    Lightbulb, 
    Check, 
    ArrowLeft,
    Edit3,
    Trash2,
    Copy,
    Download,
    ExternalLink,
    CheckCircle2,
    FileText
} from 'lucide-react';
import AIInsightCard from './AIInsightCard';
import TranscriptChat from './TranscriptChat';

const MeetingDetails = ({ meeting, standalone = false, onBack, onDelete, onUpdate, isLoading }) => {
    const [completedTasks, setCompletedTasks] = useState(new Set());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editSummary, setEditSummary] = useState('');
    const [editNotes, setEditNotes] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleEditClick = () => {
        setIsMenuOpen(false);
        setEditTitle(meeting.title || "Untitled Meeting");
        setEditSummary(meeting.summary || "");
        setEditNotes(meeting.notes || "");
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (editTitle.trim() !== "") {
            if (onUpdate) {
                onUpdate({ 
                    ...meeting, 
                    title: editTitle.trim(),
                    summary: editSummary.trim(),
                    notes: editNotes.trim()
                });
            }
            setIsEditModalOpen(false);
            showToast("Meeting info updated!");
        }
    };

    const handleCopyLink = () => {
        setIsMenuOpen(false);
        const link = window.location.href;
        navigator.clipboard.writeText(link).then(() => {
            showToast("Meeting link copied to clipboard!");
        });
    };

    const handleExportPDF = () => {
        setIsMenuOpen(false);
        window.print();
    };

    const handleViewOriginal = () => {
        setIsMenuOpen(false);
        showToast("Original audio file not available in local mock mode.");
    };

    const handleDeleteClick = () => {
        setIsMenuOpen(false);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setIsDeleteModalOpen(false);
        if (onDelete) {
            onDelete(meeting.meetingId);
        }
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
    if (isLoading) {
        return (
            <div className="flex-1 h-full bg-transparent flex flex-col animate-pulse">
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
                    <div className="w-full">
                        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
                        <div className="flex gap-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-8 space-y-10">
                    <div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-6"></div>
                        <div className="h-32 bg-gray-100 dark:bg-gray-800/50 rounded-2xl w-full"></div>
                    </div>
                    <div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800/50 rounded-2xl w-full"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!meeting) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-transparent h-full animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-6">
                    <Calendar size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Select a Meeting
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center">
                    Choose a meeting from the list to view its details, insights, and action items.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 h-full bg-transparent flex flex-col relative transition-colors duration-200 print:h-auto print:block print:bg-white">
            {/* Header */}
            <div className={`px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start sticky top-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg z-10 transition-colors print:static print:bg-white print:border-none print:px-0 print:py-4 ${standalone ? 'w-full' : ''}`}>
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
                <div className="flex gap-2 print:hidden">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                        <Share size={16} />
                        Share
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={toggleMenu}
                            className={`p-2 rounded-lg transition-colors ${isMenuOpen ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            <MoreVertical size={18} />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                <button onClick={handleEditClick} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <Edit3 size={16} className="text-gray-400" />
                                    <span>Manage Meeting Info</span>
                                </button>
                                <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <Copy size={16} className="text-gray-400" />
                                    <span>Copy Meeting Link</span>
                                </button>
                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                                <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <Download size={16} className="text-gray-400" />
                                    <span>Export as PDF</span>
                                </button>
                                <button onClick={handleViewOriginal} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <ExternalLink size={16} className="text-gray-400" />
                                    <span>View Original File</span>
                                </button>
                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                                <button onClick={handleDeleteClick} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium">
                                    <Trash2 size={16} />
                                    <span>Delete Meeting</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-y-auto p-8 space-y-10 print:overflow-visible print:h-auto print:p-0 print:space-y-6 ${standalone ? 'w-full scrollbar-hide' : ''}`}>
                {/* Notes (If any) */}
                {meeting.notes && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <FileText size={20} className="text-blue-500" />
                            Meeting Notes
                        </h2>
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/50 p-6 rounded-2xl shadow-sm">
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{meeting.notes}</p>
                        </div>
                    </section>
                )}

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


            {/* Modals and Toasts (Not printed) */}
            <div className="print:hidden">
                {/* TOAST */}
                {toastMessage && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <CheckCircle2 size={18} className="text-emerald-400 dark:text-emerald-600" />
                        <span className="text-sm font-medium">{toastMessage}</span>
                    </div>
                )}

                {/* EDIT MODAL */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800 m-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Manage Meeting Info</h3>
                            
                            <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting Title</label>
                                    <input 
                                        type="text" 
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
                                    <textarea 
                                        value={editSummary}
                                        onChange={(e) => setEditSummary(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Notes</label>
                                    <textarea 
                                        value={editNotes}
                                        onChange={(e) => setEditNotes(e.target.value)}
                                        rows={4}
                                        placeholder="Add your personal notes here..."
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
                                <button onClick={handleSaveEdit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-600/20">Save Changes</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* DELETE MODAL */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800 m-4">
                            <div className="flex gap-4 items-start mb-6">
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 flex-shrink-0">
                                    <Trash2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Delete Meeting</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this meeting? This action cannot be undone.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
                                <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm shadow-red-600/20">Delete Meeting</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeetingDetails;
