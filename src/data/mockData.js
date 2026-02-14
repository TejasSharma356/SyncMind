export const meetings = [
    {
        id: 1,
        title: "Product Strategy Alignment",
        date: "October 12, 2023",
        time: "10:00 AM",
        duration: "45m",
        category: "Strategy",
        participants: 4,
        snippet: "Discussing the roadmap for Q4 and prioritizing the new integration module features with the engineering team.",
    },
    {
        id: 2,
        title: "Weekly Design Sync",
        date: "October 10, 2023",
        time: "2:00 PM",
        duration: "32m",
        category: "Design",
        participants: 3,
        snippet: "Reviewing the latest mockups for the mobile app redesign and feedback on the typography changes.",
    },
    {
        id: 3,
        title: "Project Apollo Status",
        date: "October 08, 2023",
        time: "11:00 AM",
        duration: "1h 12m",
        category: "Management",
        participants: 6,
        snippet: "Budget updates and timeline adjustments for the Apollo launch in late November. Key stakeholders present.",
    },
    {
        id: 4,
        title: "Marketing Brainstorm",
        date: "October 05, 2023",
        time: "4:30 PM",
        duration: "50m",
        category: "Marketing",
        participants: 5,
        snippet: "Ideation for the holiday campaign. Social media outreach strategies and influencer partnership list.",
    },
];

export const transcriptData = {
    1: [
        {
            id: 1,
            speaker: "Sarah Miller",
            initial: "S",
            time: "10:02 AM",
            text: "Good morning everyone. Let's dive into the Q4 roadmap. I want to focus particularly on the integration module. We've had several requests from the enterprise tier for better data syncing with their CRM. David, where are we with the current architecture?",
        },
        {
            id: 2,
            speaker: "David Chen",
            initial: "D",
            time: "10:05 AM",
            text: "The architecture is about 60% complete. We're using a webhooks-based system to ensure real-time updates. The main bottleneck right now is the rate-limiting on the legacy endpoints. We might need another week to optimize the queuing system before we can start beta testing.",
        },
        {
            type: "insight",
            title: "SyncMInd Insight",
            content: "I've noted David's concern regarding legacy endpoint rate-limiting. Historical data suggests this typically adds 15% to the QA timeline. Suggested action: Review the queuing microservice documentation from the Mercury project."
        },
        {
            id: 3,
            speaker: "Sarah Miller",
            initial: "S",
            time: "10:08 AM",
            text: "That's a good point. Let's make sure we allocate that extra buffer in the sprint planning. Does the marketing team have what they need for the initial teaser campaign?",
        },
        {
            id: 4,
            speaker: "Marcus Wright",
            initial: "M",
            time: "10:11 AM",
            text: "We're almost there. We just need a final list of supported CRM platforms to finalize the copy. If we can get that by Friday, we're on track for the November 1st teaser release.",
        },
    ],
};
