import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AppState, Story, Claim, Source } from '../types';

const STORAGE_KEY = 'journalist_app_v1';

const initialState: AppState = {
    currentStory: null,
    claims: [],
    sources: [],
};

type JournalistContextType = {
    state: AppState;
    setStory: (story: Story) => void;
    addClaim: (claim: Claim) => void;
    updateClaim: (claim: Claim) => void;
    removeClaim: (id: string) => void;
    addSource: (source: Source) => void;
    updateSource: (source: Source) => void;
    removeSource: (id: string) => void;
    resetStory: () => void;
    loadTestData: (testData: AppState) => void;
};

const JournalistContext = createContext<JournalistContextType | undefined>(undefined);

export function JournalistProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AppState>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : initialState;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const setStory = (story: Story) => {
        setState((prev) => ({ ...prev, currentStory: story }));
    };

    const addClaim = (claim: Claim) => {
        setState((prev) => ({ ...prev, claims: [...prev.claims, claim] }));
    };

    const updateClaim = (updatedClaim: Claim) => {
        setState((prev) => ({
            ...prev,
            claims: prev.claims.map((c) => (c.id === updatedClaim.id ? updatedClaim : c)),
        }));
    };

    const removeClaim = (id: string) => {
        setState((prev) => ({
            ...prev,
            claims: prev.claims.filter((c) => c.id !== id),
        }));
    };

    const addSource = (source: Source) => {
        setState((prev) => ({ ...prev, sources: [...prev.sources, source] }));
    };

    const updateSource = (updatedSource: Source) => {
        setState((prev) => ({
            ...prev,
            sources: prev.sources.map((s) => (s.id === updatedSource.id ? updatedSource : s)),
        }));
    };

    const removeSource = (id: string) => {
        setState((prev) => ({
            ...prev,
            sources: prev.sources.filter((s) => s.id !== id),
        }));
    };

    const resetStory = () => {
        setState(initialState);
    };

    const loadTestData = (testData: AppState) => {
        // console.log('loadTestData called with:', testData);
        setState(testData);
    };

    return (
        <JournalistContext.Provider value= {{
        state,
            setStory,
            addClaim,
            updateClaim,
            removeClaim,
            addSource,
            updateSource,
            removeSource,
            resetStory,
            loadTestData
    }
}>
    { children }
    </JournalistContext.Provider>
    );
}

export function useJournalistStore() {
    const context = useContext(JournalistContext);
    if (context === undefined) {
        throw new Error('useJournalistStore must be used within a JournalistProvider');
    }
    return context;
}
