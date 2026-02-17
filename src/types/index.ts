export type Story = {
    id: string;
    title: string;
    summary: string;
    deadline: string; // ISO date string
    sensitivity: 'Investigative' | 'Breaking News' | 'Feature' | 'Profile' | 'Standard';
    createdAt: number;
    updatedAt: number;
};

export type ClaimType = 'Factual' | 'Statistical' | 'Historical' | 'Attribution' | 'Identity';
export type ClaimStatus = 'Unverified' | 'Verified' | 'Disputed' | 'False' | 'Unverifiable';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type Claim = {
    id: string;
    storyId: string;
    text: string;
    type: ClaimType;
    source: string; // The source of the claim (e.g., "Interview with X")
    status: ClaimStatus;
    priority: Priority;
    notes: string;
    verificationLogs: VerificationLog[];
};

export type VerificationLog = {
    id: string;
    claimId: string;
    method: string;
    sourcesFound: string[];
    finding: string;
    verdict: ClaimStatus;
    confidence: 'High' | 'Medium' | 'Low';
    timestamp: number;
};

export type SourceType = 'Primary' | 'Secondary' | 'Anonymous' | 'Documentary';
export type SourceStake = 'None' | 'Low' | 'Medium' | 'High';
export type SourceAssessment = 'Credible' | 'Use with caution' | 'Requires corroboration' | 'Unreliable';

export type Source = {
    id: string;
    storyId: string;
    name: string; // Or pseudonym if confidential
    type: SourceType;
    isConfidential: boolean;
    stake: SourceStake;
    corroborated: 'Yes' | 'No' | 'Partially';
    assessment: SourceAssessment;
    notes: string;
};

export type AppState = {
    currentStory: Story | null;
    claims: Claim[];
    sources: Source[];
};
