export const mockMeetings = [
    {
        meetingId: 'm1',
        title: 'Project Kickoff & Brainstorming',
        summary: 'Initial discussion on project goals, architecture, and timeline.',
        createdAt: new Date().toISOString(),
        transcript: "Speaker 1: Let's start by defining our main objectives for this quarter. Speaker 2: I think our primary focus should be the new user dashboard. Speaker 1: Agreed. Can you take the lead on the frontend implementation? Speaker 2: Sure, I will have a prototype ready by next Tuesday.",
        key_points: [
            'Defined primary objective: New user dashboard.',
            'Agreed on a rapid prototyping approach for the frontend.'
        ],
        insights: [
            { text: 'The team is highly aligned on the quarterly goals.' },
            { text: 'Frontend development is on the critical path.' }
        ],
        action_items: [
            { task: 'Create frontend prototype for dashboard', owner: 'Bob' },
            { task: 'Draft initial backend API specs', owner: 'Alice' }
        ]
    },
    {
        meetingId: 'm2',
        title: 'Weekly Sync: Backend Architecture',
        summary: 'Reviewing the database schema and API endpoints.',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        transcript: "Speaker 3: I reviewed the API specs Alice drafted. They look good, but we need to refine the authentication flow. Speaker 1: Good catch. I will update the auth endpoints tomorrow.",
        key_points: [
            'API specs look solid overall.',
            'Authentication flow requires refinement.'
        ],
        insights: [
            { text: 'Security considerations were prioritized early in the discussion.' }
        ],
        action_items: [
            { task: 'Update auth endpoints in API specs', owner: 'Alice' }
        ]
    }
];
