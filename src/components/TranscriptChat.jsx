import React from 'react';

const speakerColors = [
    'text-blue-600 dark:text-blue-400',
    'text-emerald-600 dark:text-emerald-400',
    'text-purple-600 dark:text-purple-400',
    'text-orange-600 dark:text-orange-400',
    'text-pink-600 dark:text-pink-400',
    'text-cyan-600 dark:text-cyan-400'
];

const TranscriptChat = ({ transcript }) => {
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

                return (
                    <div key={i} className="flex flex-col gap-3 bg-gray-100 dark:bg-gray-800/60 p-6 rounded-3xl text-lg w-full max-w-4xl shadow-sm border border-gray-100 dark:border-gray-800/50">
                        <span className={`text-sm font-bold uppercase tracking-wider ${colorClass}`}>
                            {block.speaker}
                        </span>
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
