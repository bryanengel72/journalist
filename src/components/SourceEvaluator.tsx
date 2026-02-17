import { useState } from 'react';
import { useJournalistStore } from '../hooks/useJournalistStore';
import type { Source, SourceType, SourceStake, SourceAssessment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function SourceEvaluator() {
    const { state, addSource, removeSource, updateSource } = useJournalistStore();
    const [isAdding, setIsAdding] = useState(false);

    // New Source Form State
    const [newSourceName, setNewSourceName] = useState('');
    const [newSourceType, setNewSourceType] = useState<SourceType>('Primary');
    const [isConfidential, setIsConfidential] = useState(false);
    const [newSourceStake, setNewSourceStake] = useState<SourceStake>('None');
    const [newSourceCorroborated, setNewSourceCorroborated] = useState<Source['corroborated']>('No');

    const calculateAssessment = (type: SourceType, stake: SourceStake, corroborated: string): SourceAssessment => {
        // Basic logic to suggest assessment
        if (type === 'Primary' && stake === 'None' && corroborated === 'Yes') return 'Credible';
        if (stake === 'High') return 'Use with caution';
        if (corroborated === 'No') return 'Requires corroboration';
        return 'Use with caution';
    };

    const handleAddSource = (e: React.FormEvent) => {
        e.preventDefault();
        if (!state.currentStory) return;

        const source: Source = {
            id: uuidv4(),
            storyId: state.currentStory.id,
            name: newSourceName,
            type: newSourceType,
            isConfidential,
            stake: newSourceStake,
            corroborated: newSourceCorroborated,
            assessment: calculateAssessment(newSourceType, newSourceStake, newSourceCorroborated),
            notes: '',
        };

        addSource(source);
        setNewSourceName('');
        setIsAdding(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Source Assessment</h3>
                <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : '+ Add Source'}
                </button>
            </div>

            {isAdding && (
                <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f8fafc' }}>
                    <form onSubmit={handleAddSource}>
                        <div className="form-group">
                            <label className="form-label">Source Name / Description</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="e.g., Police Chief, Anonymous Neighbor"
                                value={newSourceName}
                                onChange={(e) => setNewSourceName(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isConfidential}
                                    onChange={(e) => setIsConfidential(e.target.checked)}
                                />
                                Confidential Source?
                            </label>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-select"
                                    value={newSourceType}
                                    onChange={(e) => setNewSourceType(e.target.value as SourceType)}
                                >
                                    <option value="Primary">Primary (Firsthand)</option>
                                    <option value="Secondary">Secondary (Reported elsewhere)</option>
                                    <option value="Documentary">Documentary (Record/File)</option>
                                    <option value="Anonymous">Anonymous</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Stake / Bias</label>
                                <select
                                    className="form-select"
                                    value={newSourceStake}
                                    onChange={(e) => setNewSourceStake(e.target.value as SourceStake)}
                                >
                                    <option value="None">None (Independent)</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High (Conflict of Interest)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Corroborated?</label>
                                <select
                                    className="form-select"
                                    value={newSourceCorroborated}
                                    onChange={(e) => setNewSourceCorroborated(e.target.value as any)}
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    <option value="Partially">Partially</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary">Save Source</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
                {state.sources.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '3rem' }}>
                        No sources added yet. Catalog all sources to assess credibility.
                    </div>
                ) : (
                    state.sources.map((source) => (
                        <SourceCard key={source.id} source={source} onDelete={() => removeSource(source.id)} onUpdate={updateSource} />
                    ))
                )}
            </div>
        </div>
    );
}

function SourceCard({ source, onDelete, onUpdate }: { source: Source; onDelete: () => void; onUpdate: (s: Source) => void }) {
    const getAssessmentColor = (assessment: string) => {
        switch (assessment) {
            case 'Credible': return 'var(--color-success)';
            case 'Unreliable': return 'var(--color-danger)';
            case 'Use with caution': return 'var(--color-warning)';
            default: return 'var(--color-text-secondary)';
        }
    };

    return (
        <div className="card" style={{ borderLeft: `4px solid ${getAssessmentColor(source.assessment)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <span style={{
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            backgroundColor: '#edf2f7',
                            color: '#4a5568',
                            fontWeight: 600
                        }}>
                            {source.type}
                        </span>
                        {source.isConfidential && (
                            <span style={{
                                fontSize: '0.7rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                                backgroundColor: '#2d3748',
                                color: 'white',
                                fontWeight: 600
                            }}>
                                Confidential
                            </span>
                        )}
                    </div>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                        {source.name}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        <span>Stake: <strong>{source.stake}</strong></span>
                        <span>Corroborated: <strong>{source.corroborated}</strong></span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <select
                        className="form-select"
                        style={{ padding: '0.25rem', fontSize: '0.8rem', width: 'auto' }}
                        value={source.assessment}
                        onChange={(e) => onUpdate({ ...source, assessment: e.target.value as any })}
                    >
                        <option value="Credible">Credible</option>
                        <option value="Use with caution">Use with caution</option>
                        <option value="Requires corroboration">Requires corroboration</option>
                        <option value="Unreliable">Unreliable</option>
                    </select>
                    <button className="btn btn-secondary" onClick={onDelete} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)', marginTop: '0.5rem' }}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
