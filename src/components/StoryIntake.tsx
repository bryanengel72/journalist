import { useState } from 'react';
import { useJournalistStore } from '../hooks/useJournalistStore';
import type { Story, Claim, Source } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { analyzeText } from '../utils/textAnalysis';

type StoryIntakeProps = {
    onComplete: () => void;
};

export function StoryIntake({ onComplete }: StoryIntakeProps) {
    const { setStory, addClaim, addSource } = useJournalistStore();
    const [storyId] = useState(uuidv4()); // Generate ID safely
    const [rawText, setRawText] = useState('');
    const [extractedData, setExtractedData] = useState<{ claims: Claim[], sources: Source[] } | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        deadline: '',
        sensitivity: 'Standard' as Story['sensitivity'],
    });

    const handleAnalyze = () => {
        if (!rawText.trim()) return;
        const result = analyzeText(rawText, storyId);
        setFormData(prev => ({
            ...prev,
            title: result.title,
            summary: result.summary
        }));
        setExtractedData({
            claims: result.claims,
            sources: result.sources
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newStory: Story = {
            id: storyId,
            ...formData,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        setStory(newStory);

        // Commit extracted data if available
        if (extractedData) {
            extractedData.claims.forEach(c => addClaim(c));
            extractedData.sources.forEach(s => addSource(s));
        }

        onComplete();
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                Step 1: Story Intake
            </h2>

            {/* Automation Section */}
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ marginTop: 0 }}>⚡️ Quick Start / Auto-Fill</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                    Paste your article draft, notes, or source text here to automatically extract claims, sources, and summary.
                </p>
                <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Paste story text here..."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                />
                <button
                    type="button"
                    onClick={handleAnalyze}
                    className="btn btn-secondary"
                    disabled={!rawText.trim()}
                >
                    Auto-Extract Data
                </button>
                {extractedData && (
                    <span style={{ marginLeft: '1rem', fontSize: '0.85rem', color: 'var(--color-success)' }}>
                        ✓ Found {extractedData.claims.length} claims and {extractedData.sources.length} sources
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="title">Story Slug / Title</label>
                    <input
                        id="title"
                        className="form-input"
                        type="text"
                        required
                        placeholder="e.g., San Diego Homelessness Investigation"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="summary">Story Summary</label>
                    <textarea
                        id="summary"
                        className="form-textarea"
                        rows={5}
                        required
                        placeholder="What is the piece about? What are the central questions?"
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    />
                </div>

                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label className="form-label" htmlFor="deadline">Deadline</label>
                        <input
                            id="deadline"
                            className="form-input"
                            type="date"
                            required
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="form-label" htmlFor="sensitivity">Sensitivity Level</label>
                        <select
                            id="sensitivity"
                            className="form-select"
                            value={formData.sensitivity}
                            onChange={(e) => setFormData({ ...formData, sensitivity: e.target.value as Story['sensitivity'] })}
                        >
                            <option value="Standard">Standard</option>
                            <option value="Feature">Feature</option>
                            <option value="Profile">Profile</option>
                            <option value="Investigative">Investigative</option>
                            <option value="Breaking News">Breaking News</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                    <button type="submit" className="btn btn-primary">
                        Start Research Phase &rarr;
                    </button>
                </div>
            </form>
        </div>
    );
}
