import { useState } from 'react';
import { useJournalistStore } from '../hooks/useJournalistStore';
import type { Story } from '../types';
import { v4 as uuidv4 } from 'uuid';

type StoryIntakeProps = {
    onComplete: () => void;
};

export function StoryIntake({ onComplete }: StoryIntakeProps) {
    const { setStory } = useJournalistStore();
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        deadline: '',
        sensitivity: 'Standard' as Story['sensitivity'],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newStory: Story = {
            id: uuidv4(),
            ...formData,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        setStory(newStory);
        onComplete();
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                Step 1: Story Intake
            </h2>
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
