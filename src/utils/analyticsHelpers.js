const MS_PER_DAY = 24 * 60 * 60 * 1000;
const WORDS_PER_MINUTE = 150;

const DURATION_MINUTE_FIELDS = [
    'durationMinutes',
    'duration_minutes',
    'durationMins',
    'duration_mins',
    'meetingDurationMinutes',
    'meeting_duration_minutes',
];

const DURATION_SECOND_FIELDS = [
    'durationSeconds',
    'duration_seconds',
    'audioDurationSeconds',
    'audio_duration_seconds',
    'meetingDurationSeconds',
    'meeting_duration_seconds',
];

/**
 * Analytics expects meetings to provide createdAt plus an optional transcript,
 * duration metadata, and action_items shaped as { task, owner, completed }.
 */
const getStartOfDay = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
};

const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const isValidDate = (date) => !Number.isNaN(date.getTime());

const toArray = (value) => (Array.isArray(value) ? value : []);

const getNumber = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
};

const getNestedValue = (meeting, field) => {
    const sources = [meeting, meeting?.metadata, meeting?.audio, meeting?.recording];

    for (const source of sources) {
        if (source && Object.prototype.hasOwnProperty.call(source, field)) {
            return source[field];
        }
    }

    return undefined;
};

const parseDurationString = (value) => {
    if (typeof value !== 'string') return null;

    const trimmed = value.trim();
    if (!trimmed) return null;

    const colonParts = trimmed.split(':').map((part) => Number(part));
    if (colonParts.length >= 2 && colonParts.length <= 3 && colonParts.every(Number.isFinite)) {
        const [hours = 0, minutes = 0, seconds = 0] = colonParts.length === 3
            ? colonParts
            : [0, colonParts[0], colonParts[1]];
        return Math.ceil((hours * 60 * 60 + minutes * 60 + seconds) / 60);
    }

    const minutesMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(m|min|mins|minute|minutes)$/i);
    if (minutesMatch) return Math.ceil(Number(minutesMatch[1]));

    const secondsMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(s|sec|secs|second|seconds)$/i);
    if (secondsMatch) return Math.ceil(Number(secondsMatch[1]) / 60);

    return null;
};

export const getActionItems = (meeting = {}) => (
    toArray(meeting?.action_items)
        .filter((item) => item && typeof item === 'object')
        .map((item) => ({
            ...item,
            task: typeof item.task === 'string' ? item.task : '',
            owner: typeof item.owner === 'string' ? item.owner : '',
            completed: item.completed === true,
        }))
);

export const getEstimatedDurationMinutes = (transcript = '') => {
    const trimmedTranscript = typeof transcript === 'string' ? transcript.trim() : '';
    if (!trimmedTranscript) return 0;

    const wordCount = trimmedTranscript.split(/\s+/).length;
    return Math.ceil(wordCount / WORDS_PER_MINUTE);
};

export const getMeetingDurationMinutes = (meeting = {}) => {
    for (const field of DURATION_MINUTE_FIELDS) {
        const minutes = getNumber(getNestedValue(meeting, field));
        if (minutes !== null && minutes > 0) {
            return { minutes: Math.ceil(minutes), source: 'metadata' };
        }
    }

    for (const field of DURATION_SECOND_FIELDS) {
        const seconds = getNumber(getNestedValue(meeting, field));
        if (seconds !== null && seconds > 0) {
            return { minutes: Math.ceil(seconds / 60), source: 'metadata' };
        }
    }

    const duration = getNestedValue(meeting, 'duration');
    const parsedDuration = getNumber(duration);
    if (parsedDuration !== null && parsedDuration > 0) {
        return { minutes: Math.ceil(parsedDuration), source: 'metadata' };
    }

    const parsedDurationString = parseDurationString(duration);
    if (parsedDurationString !== null && parsedDurationString > 0) {
        return { minutes: parsedDurationString, source: 'metadata' };
    }

    const estimatedMinutes = getEstimatedDurationMinutes(meeting?.transcript || '');
    return {
        minutes: estimatedMinutes,
        source: estimatedMinutes > 0 ? 'transcript' : 'unknown',
    };
};

export const getRecentMeetings = (meetings = [], days = 30) => {
    const today = getStartOfDay(new Date());
    const startDate = new Date(today.getTime() - (days - 1) * MS_PER_DAY);
    const endDate = new Date(today.getTime() + MS_PER_DAY);

    return toArray(meetings).filter((meeting) => {
        const meetingDate = new Date(meeting?.createdAt);
        return isValidDate(meetingDate) && meetingDate >= startDate && meetingDate < endDate;
    });
};

export const getMeetingFrequency = (meetings = [], days = 30) => {
    const today = getStartOfDay(new Date());
    const startDate = new Date(today.getTime() - (days - 1) * MS_PER_DAY);
    const meetingCounts = toArray(meetings).reduce((acc, meeting) => {
        const meetingDate = new Date(meeting?.createdAt);
        if (!isValidDate(meetingDate)) return acc;

        const day = getStartOfDay(meetingDate);
        const dateKey = formatDateKey(day);
        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
    }, {});

    return Array.from({ length: days }, (_, index) => {
        const date = new Date(startDate.getTime() + index * MS_PER_DAY);
        const dateKey = formatDateKey(date);

        return {
            date: dateKey,
            label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            fullDate: date.toLocaleDateString(undefined, { dateStyle: 'medium' }),
            count: meetingCounts[dateKey] || 0,
        };
    });
};

export const getDurationStats = (meetings = []) => {
    const durations = toArray(meetings)
        .map((meeting) => ({
            meeting,
            ...getMeetingDurationMinutes(meeting),
        }))
        .filter((item) => item.minutes > 0);

    const totalMinutes = durations.reduce((sum, item) => sum + item.minutes, 0);
    const average = durations.length > 0 ? Math.round(totalMinutes / durations.length) : 0;
    const sortedDurations = [...durations].sort((a, b) => a.minutes - b.minutes);
    const shortest = sortedDurations[0] || null;
    const longest = sortedDurations[sortedDurations.length - 1] || null;

    const buckets = [
        { name: 'Short', label: '<15 min', value: 0, fill: '#22c55e' },
        { name: 'Medium', label: '15-45 min', value: 0, fill: '#3b82f6' },
        { name: 'Long', label: '45+ min', value: 0, fill: '#f97316' },
    ];

    durations.forEach(({ minutes }) => {
        if (minutes < 15) {
            buckets[0].value += 1;
        } else if (minutes <= 45) {
            buckets[1].value += 1;
        } else {
            buckets[2].value += 1;
        }
    });

    return {
        average,
        totalMinutes,
        longest,
        shortest,
        buckets,
        knownCount: durations.length,
        metadataCount: durations.filter((item) => item.source === 'metadata').length,
        estimatedCount: durations.filter((item) => item.source === 'transcript').length,
        unknownCount: Math.max(toArray(meetings).length - durations.length, 0),
    };
};

export const getTopParticipants = (meetings = [], limit = 5) => {
    const ownerCounts = toArray(meetings)
        .flatMap(getActionItems)
        .reduce((acc, item) => {
            const owner = item.owner?.trim();
            if (!owner) return acc;

            acc[owner] = (acc[owner] || 0) + 1;
            return acc;
        }, {});

    return Object.entries(ownerCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .slice(0, limit);
};

export const getInsightsSummary = (meetings = []) => {
    const safeMeetings = toArray(meetings);
    const actionItems = safeMeetings.flatMap(getActionItems);
    const completedItems = actionItems.filter((item) => item.completed === true);
    const durationStats = getDurationStats(getRecentMeetings(safeMeetings));

    return {
        totalMeetings: safeMeetings.length,
        pendingActionItems: actionItems.length - completedItems.length,
        completionRate: actionItems.length > 0
            ? Math.round((completedItems.length / actionItems.length) * 100)
            : null,
        averageDuration: durationStats.average,
        hasDurationData: durationStats.knownCount > 0,
        durationSourceDetail: durationStats.metadataCount > 0
            ? 'Using saved duration metadata when available'
            : 'Estimated from transcript length when available',
    };
};
