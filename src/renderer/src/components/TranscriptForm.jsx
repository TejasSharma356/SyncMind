import React, { useState } from 'react';

export default function TranscriptForm({ onSubmit, isLoading }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="transcript" className="text-sm font-medium text-text">
                    Meeting Transcript
                </label>
                <textarea
                    id="transcript"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your meeting transcript here..."
                    className="w-full h-48 bg-surface border border-white/10 rounded-lg p-4 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !text.trim()}
                className="self-end px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Processing...' : 'Process'}
            </button>
        </form>
    );
}
