const STORAGE_KEY = 'syncmind_speaker_names';

const readAllMappings = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (err) {
        console.warn('[SpeakerNames] Failed to read stored speaker names:', err);
        return {};
    }
};

export const getSpeakerNameMap = (meetingId) => {
    if (!meetingId) return {};
    return readAllMappings()[meetingId] || {};
};

export const setSpeakerName = (meetingId, originalSpeaker, newName) => {
    if (!meetingId || !originalSpeaker) return;

    const normalized = originalSpeaker.trim().toLowerCase();
    const trimmedNewName = (newName || '').trim();
    const all = readAllMappings();
    const meetingMap = { ...(all[meetingId] || {}) };

    if (trimmedNewName && trimmedNewName.toLowerCase() !== normalized) {
        meetingMap[normalized] = trimmedNewName;
    } else {
        delete meetingMap[normalized];
    }

    if (Object.keys(meetingMap).length > 0) {
        all[meetingId] = meetingMap;
    } else {
        delete all[meetingId];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
};
