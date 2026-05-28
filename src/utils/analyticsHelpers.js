const MS_PER_DAY = 24 * 60 * 60 * 1000;
const WORDS_PER_MINUTE = 150;

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

export const getEstimatedDurationMinutes = (transcript = '') => {
    const trimmedTranscript = transcript.trim();
    if (!trimmedTranscript) return 0;

    const wordCount = trimmedTranscript.split(/\s+/).length;
    return Math.ceil(wordCount / WORDS_PER_MINUTE);
};

export const getRecentMeetings = (meetings = [], days = 30) => {
    const today = getStartOfDay(new Date());
    const startDate = new Date(today.getTime() - (days - 1) * MS_PER_DAY);
    const endDate = new Date(today.getTime() + MS_PER_DAY);

    return meetings.filter((meeting) => {
        const meetingDate = new Date(meeting.createdAt);
        return isValidDate(meetingDate) && meetingDate >= startDate && meetingDate < endDate;
    });
};

export const getMeetingFrequency = (meetings = [], days = 30) => {
    const today = getStartOfDay(new Date());
    const startDate = new Date(today.getTime() - (days - 1) * MS_PER_DAY);
    const meetingCounts = meetings.reduce((acc, meeting) => {
        const meetingDate = new Date(meeting.createdAt);
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
    const durations = meetings.map((meeting) => ({
        meeting,
        minutes: getEstimatedDurationMinutes(meeting.transcript || ''),
    }));

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
    };
};

export const getTopParticipants = (meetings = [], limit = 5) => {
    const ownerCounts = meetings
        .flatMap((meeting) => meeting.action_items || [])
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
    const actionItems = meetings.flatMap((meeting) => meeting.action_items || []);
    const completedItems = actionItems.filter((item) => item.completed === true);
    const trackedItems = actionItems.filter((item) => typeof item.completed === 'boolean');
    const durationStats = getDurationStats(getRecentMeetings(meetings));

    return {
        totalMeetings: meetings.length,
        pendingActionItems: actionItems.length - completedItems.length,
        completionRate: trackedItems.length > 0
            ? Math.round((completedItems.length / trackedItems.length) * 100)
            : null,
        averageDuration: durationStats.average,
    };
};
