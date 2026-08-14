import React, { useEffect, useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { getSpeakerNameMap, setSpeakerName } from '../utils/speakerNames';

const speakerColors = [
    'text-blue-600 dark:text-blue-400',
    'text-emerald-600 dark:text-emerald-400',
    'text-purple-600 dark:text-purple-400',
    'text-orange-600 dark:text-orange-400',
    'text-pink-600 dark:text-pink-400',
    'text-cyan-600 dark:text-cyan-400'
];

const TranscriptChat = ({ transcript, meetingId }) => {
    const [nameMap, setNameMap] = useState(() => getSpeakerNameMap(meetingId));
    const [editingKey, setEditingKey] = useState(null);
    const [editValue, setEditValue] = useState('');

    // Reset the rename mapping/edit state whenever the viewed meeting changes
    useEffect(() => {
        setNameMap(getSpeakerNameMap(meetingId));
        setEditingKey(null);
    }, [meetingId]);

    if (!transcript) return null;

    // Clean up punctuation spacing (e.g. "word , ." -> "word,.")
    const cleanText = (str) => {
        return str
            .replace(/\s+([,.!?;:])/g, '$1')
            .replace(/\s+/g, ' ')
            .trim();
    };

    // Split transcript by double newlines to get distinct blocks
    const rawBlocks = transcript.split(/\n\n+/);
    const grouped = [];

    for (let i = 0; i < rawBlocks.length; i++) {
        const blockText = rawBlocks[i].trim();
        if (!blockText) continue;

        // Try to match "Name: Text" (matches everything before the first colon as the speaker)
        const match = blockText.match(/^([^:]+):\s*([\s\S]*)$/);
        
        if (match) {
            let speaker = match[1].trim();
            if (speaker.toUpperCase() === 'OMITTED' || speaker.toUpperCase() === 'UNKNOWN') {
                speaker = 'UNKNOWN SPEAKER';
            }
            const text = cleanText(match[2]);

            // Consecutive blocks from the same speaker get merged
            const last = grouped[grouped.length - 1];
            if (last && last.speaker === speaker) {
                last.text += ' ' + text;
            } else {
                grouped.push({ type: 'speaker', speaker, text });
            }
        } else {
            // No speaker label, fallback
            const text = cleanText(blockText);
            if (text) {
                grouped.push({ type: 'fallback', text });
            }
        }
    }

    // Dynamic color mapping for arbitrary speaker names
    let nextColorIndex = 0;
    const speakerColorMap = {};

    const getSpeakerColorClass = (speakerName) => {
        // Normalize "Speaker 1", "speaker 1" etc to same color
        const normalized = speakerName.toLowerCase();
        if (!speakerColorMap[normalized]) {
            speakerColorMap[normalized] = speakerColors[nextColorIndex % speakerColors.length];
            nextColorIndex++;
        }
        return speakerColorMap[normalized];
    };

    const startEditing = (blockIndex, originalSpeaker) => {
        const normalized = originalSpeaker.trim().toLowerCase();
        setEditingKey(blockIndex);
        setEditValue(nameMap[normalized] || originalSpeaker);
    };

    const commitEdit = (originalSpeaker) => {
        setSpeakerName(meetingId, originalSpeaker, editValue);
        setNameMap(getSpeakerNameMap(meetingId));
        setEditingKey(null);
    };

    const cancelEdit = () => setEditingKey(null);

    return (
        <div className="flex flex-col items-start gap-6 mt-4">
            {grouped.map((block, i) => {
                if (block.type === 'fallback') {
                    return (
                        <div key={i} className="text-base text-gray-500 italic text-center my-4 w-full">
                            {block.text}
                        </div>
                    );
                }

                const colorClass = getSpeakerColorClass(block.speaker);
                const normalized = block.speaker.trim().toLowerCase();
                const displayName = nameMap[normalized] || block.speaker;
                const isEditing = editingKey === i;

                return (
                    <div key={i} className="flex flex-col gap-3 bg-gray-100 dark:bg-gray-800/60 p-6 rounded-3xl text-lg w-full max-w-4xl shadow-sm border border-gray-100 dark:border-gray-800/50">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') commitEdit(block.speaker);
                                        if (e.key === 'Escape') cancelEdit();
                                    }}
                                    className={`text-sm font-bold uppercase tracking-wider bg-transparent border-b border-current outline-none ${colorClass}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => commitEdit(block.speaker)}
                                    title="Save name"
                                    className="text-emerald-500 hover:text-emerald-600"
                                >
                                    <Check size={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    title="Cancel"
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => meetingId && startEditing(i, block.speaker)}
                                title={meetingId ? 'Click to rename speaker' : undefined}
                                className={`group/speaker w-fit flex items-center gap-1.5 bg-transparent border-0 p-0 text-left text-sm font-bold uppercase tracking-wider ${colorClass} ${meetingId ? 'cursor-text' : 'cursor-default'}`}
                            >
                                {displayName}
                                {meetingId && (
                                    <Pencil size={11} className="opacity-0 group-hover/speaker:opacity-60 transition-opacity" />
                                )}
                            </button>
                        )}
                        <span className="leading-relaxed text-gray-800 dark:text-gray-200">
                            {block.text}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default TranscriptChat;
