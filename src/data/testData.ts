import type { AppState, Story, Claim, Source } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORY_ID = uuidv4();

const testStory: Story = {
    id: STORY_ID,
    title: "Rising Homelessness in San Diego",
    summary: "Investigation into the reported 22% increase in homelessness in San Diego, verifying official numbers against independent counts.",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    sensitivity: "Standard",
    createdAt: Date.now(),
    updatedAt: Date.now(),
};

const testClaims: Claim[] = [
    {
        id: uuidv4(),
        storyId: STORY_ID,
        text: "Homeless population in San Diego increased by 22% last year.",
        type: "Statistical",
        source: "City Official Interview",
        status: "Unverified",
        priority: "Critical",
        notes: "Need to verify against HUD Point-in-Time counts.",
        verificationLogs: [],
    },
    {
        id: uuidv4(),
        storyId: STORY_ID,
        text: "The new shelter policy has reduced street encampments by 50%.",
        type: "Factual",
        source: "Mayor's Press Release",
        status: "Unverified",
        priority: "High",
        notes: "Check police reports and independent advocate observations.",
        verificationLogs: [],
    },
    {
        id: uuidv4(),
        storyId: STORY_ID,
        text: "San Diego has the highest rate of veteran homelessness in the state.",
        type: "Statistical",
        source: "Advocacy Group Report",
        status: "Disputed",
        priority: "Medium",
        notes: "Conflicting data from VA reports.",
        verificationLogs: [],
    }
];

const testSources: Source[] = [
    {
        id: uuidv4(),
        storyId: STORY_ID,
        name: "City Official (Jane Doe)",
        type: "Primary",
        isConfidential: false,
        stake: "High",
        corroborated: "No",
        assessment: "Use with caution",
        notes: "Has political incentive to show progress/funding needs.",
    },
    {
        id: uuidv4(),
        storyId: STORY_ID,
        name: "Downtown Business Association",
        type: "Secondary",
        isConfidential: false,
        stake: "Medium",
        corroborated: "Partially",
        assessment: "Credible",
        notes: "Represents business interests, may overlap with city data.",
    },
    {
        id: uuidv4(),
        storyId: STORY_ID,
        name: "Anonymous Shelter Worker",
        type: "Primary",
        isConfidential: true,
        stake: "Low",
        corroborated: "No",
        assessment: "Credible",
        notes: "First-hand account of shelter conditions.",
    }
];

export const testData: AppState = {
    currentStory: testStory,
    claims: testClaims,
    sources: testSources,
};
