import React from 'react';

const TranscriptChat = ({ transcript }) => {
    if (!transcript) return null;

    // Split by newlines and remove empty lines
    const lines = transcript.split('\n').filter(l => l.trim() !== '');

    const grouped = [];
    let currentBlock = null;

    lines.forEach(line => {
        const splitIndex = line.indexOf(':');

        // Group consecutive lines from the same speaker and handle multi-line text
        if (splitIndex !== -1 && line.substring(0, splitIndex).toLowerCase().includes('speaker')) {
            const speaker = line.substring(0, splitIndex).trim();
            const text = line.substring(splitIndex + 1).trim();

            if (currentBlock && currentBlock.speaker === speaker) {
                currentBlock.text += ' ' + text;
            } else {
                if (currentBlock) grouped.push(currentBlock);
                currentBlock = { type: 'speaker', speaker, text: text };
            }
        } else {
            if (currentBlock) {
                currentBlock.text += ' ' + line.trim();
            } else {
                grouped.push({ type: 'fallback', text: line.trim() });
            }
        }
    });

    if (currentBlock) grouped.push(currentBlock);

    return (
        <div className="flex flex-col items-start gap-4 mt-2">
            {grouped.map((block, i) => {
                if (block.type === 'fallback') {
                    return (
                        <div key={i} className="text-sm text-gray-500 italic text-center my-2">
                            {block.text}
                        </div>
                    );
                }

                return (
                    <div key={i} className="flex flex-col gap-2 bg-gray-100 dark:bg-gray-800/60 p-4 rounded-2xl text-sm text-gray-900 dark:text-gray-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
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
