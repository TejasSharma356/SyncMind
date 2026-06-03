export const mockMeetings = [
    {
        meetingId: 'm1',
        title: '✨ Welcome to SyncMind! (Mock Review)',
        summary: 'A quick overview of SyncMind\'s automated AI meeting intelligence pipeline and portal dashboard features.',
        createdAt: new Date().toISOString(),
        transcript: "Speaker 1: Welcome to SyncMind! If you are seeing this, it means you have successfully logged in and completed your onboarding profile. This is a demonstration meeting view showing you how transcripts, action items, and automated insights will populate once you record your first live session.\n\nSpeaker 2: Exactly. The desktop companion app sits silently in your Windows system tray, captures audio from both local speakers and microphones, uploads it securely to our AWS S3 pipeline, and utilizes AI to automatically generate meeting records in near real-time.\n\nSpeaker 1: That means no more manual note-taking. Everything from team alignments, key decisions, and immediate next steps is organized cleanly right here.",
        key_points: [
            'This is a demonstration meeting view designed to showcase SyncMind\'s rich analytics.',
            'SyncMind desktop companion records both mic and system audio in real-time.',
            'AI pipelines automatically process raw audio into transcripts, key points, and action items.'
        ],
        insights: [
            { text: 'This is a mock view. Real meetings will load instantly here once they are recorded via the desktop client.' },
            { text: 'To record a meeting, you must install the desktop client on your Windows system.' }
        ],
        action_items: [
            { task: 'Download the SyncMind Desktop Companion app', owner: 'New User' },
            { task: 'Record your first live session using the companion app', owner: 'New User' }
        ]
    }
];
