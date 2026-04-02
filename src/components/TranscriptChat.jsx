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

    // Helper to clean up punctuation spacing (e.g. "word , ." -> "word,.")
    const cleanText = (str) => {
        return str
            .replace(/\s+([,.!?;:])/g, '$1') // Remove space before punctuation
            .replace(/\s+/g, ' ')           // Collapse multiple spaces
            .trim();
    }

    // Capture Speaker tags (e.g. "Speaker 1:")
    // We use a regex that splits while keeping the tags
    const speakerRegex = /(Speaker\s+\d+:)/gi;
    const rawParts = transcript.split(speakerRegex);

    const grouped = [];
    let currentBlock = null;

    // Helper to check if text ends with terminal punctuation
    const isTerminal = (text) => {
        const trimmed = text.trim();
        return trimmed && /[.?!]$/.test(trimmed);
    };

    // Words that are likely to start a new speaker's sentence if trapped at the end of the previous speaker.
    const sentenceStarters = new Set(['all', 'if', 'and', 'but', 'so', 'then', 'right', 'ok', 'okay', 'great', 'well', 'anyway', 'now', 'or', 'because', 'uh', 'um']);

    for (let i = 0; i < rawParts.length; i++) {
        const part = rawParts[i].trim();
        if (!part) continue;

        if (part.match(speakerRegex)) {
            const speaker = part.replace(':', '').trim();
            let text = (rawParts[i + 1] || '').trim();
            i++;

            let didStitchForward = false;

            // --- STEP 1: FORWARD-STITCHING (Pull misplaced starters from previous block) ---
            if (currentBlock && !isTerminal(currentBlock.text)) {
                const words = currentBlock.text.trim().split(/\s+/);
                const lastWord = words[words.length - 1];
                const lastWordLower = lastWord?.toLowerCase().replace(/[^a-z]/g, '');

                // If it's a known starter OR it's capitalized (and not the only word), move it forward.
                if (lastWord && (sentenceStarters.has(lastWordLower) || (lastWord[0] === lastWord[0].toUpperCase() && words.length > 1))) {
                    words.pop();
                    currentBlock.text = cleanText(words.join(' '));
                    text = lastWord + ' ' + text;
                    didStitchForward = true;
                }
            }

            // --- STEP 2: BACK-STITCHING (Push fragments/acronyms back to previous block) ---
            const textTrimmed = text.trim();
            const prevTextTrimmed = currentBlock ? currentBlock.text.trim() : '';
            const startsWithLowercase = /^[a-z]/.test(textTrimmed);
            const prevMissingPunctuation = prevTextTrimmed && !isTerminal(prevTextTrimmed);

            // Important: If we just pulled a word forward, we skip pushing it back unless it's strictly lowercase.
            if (currentBlock && textTrimmed && (startsWithLowercase || (prevMissingPunctuation && !didStitchForward))) {
                const breakMatch = textTrimmed.match(/([.?!]\s+)/);
                if (breakMatch) {
                    const breakIndex = breakMatch.index + breakMatch[0].length;
                    const fragment = textTrimmed.substring(0, breakIndex);
                    currentBlock.text += ' ' + cleanText(fragment);
                    text = textTrimmed.substring(breakIndex);
                } else if (startsWithLowercase) {
                    currentBlock.text += ' ' + cleanText(textTrimmed);
                    text = '';
                } else if (prevMissingPunctuation && !didStitchForward) {
                    // Only push back short acronyms/metadata that logically belong to what the previous speaker was saying.
                    const words = textTrimmed.split(/\s+/);
                    const firstWord = words[0];
                    if (firstWord && (firstWord.length <= 3 || firstWord === firstWord.toUpperCase()) && !sentenceStarters.has(firstWord.toLowerCase())) {
                        currentBlock.text += ' ' + cleanText(firstWord);
                        text = words.slice(1).join(' ');
                    }
                }
            }

            if (text.trim()) {
                if (currentBlock && currentBlock.speaker === speaker) {
                    currentBlock.text += ' ' + cleanText(text);
                } else {
                    if (currentBlock) {
                        currentBlock.text = cleanText(currentBlock.text);
                        grouped.push(currentBlock);
                    }
                    currentBlock = { type: 'speaker', speaker, text };
                }
            }
        } else {
            // It's either leading fallback text or text that got split weirdly
            if (currentBlock) {
                currentBlock.text += ' ' + part;
            } else {
                grouped.push({ type: 'fallback', text: cleanText(part) });
            }
        }
    }

    if (currentBlock) {
        currentBlock.text = cleanText(currentBlock.text);
        grouped.push(currentBlock);
    }

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

                // Extract a number from "Speaker 1" to assign consistent colors
                const match = block.speaker.match(/\d+/);
                const speakerNum = match ? parseInt(match[0], 10) : 1;
                const colorClass = speakerColors[(speakerNum - 1) % speakerColors.length];

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
