import { useState } from 'react';
import { useJournalistStore } from '../hooks/useJournalistStore';
import type { Claim, ClaimType, Priority } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function ClaimManager() {
    const { state, addClaim, removeClaim, updateClaim } = useJournalistStore();
    const [isAdding, setIsAdding] = useState(false);

    // New Claim Form State
    const [newClaimText, setNewClaimText] = useState('');
    const [newClaimType, setNewClaimType] = useState<ClaimType>('Factual');
    const [newClaimSource, setNewClaimSource] = useState('');
    const [newClaimPriority, setNewClaimPriority] = useState<Priority>('Medium');

    const handleAddClaim = (e: React.FormEvent) => {
        e.preventDefault();
        if (!state.currentStory) return;

        const claim: Claim = {
            id: uuidv4(),
            storyId: state.currentStory.id,
            text: newClaimText,
            type: newClaimType,
            source: newClaimSource,
            status: 'Unverified',
            priority: newClaimPriority,
            notes: '',
            verificationLogs: [],
        };

        addClaim(claim);
        setNewClaimText('');
        setNewClaimSource('');
        setIsAdding(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Claims Extraction</h3>
                <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : '+ Add Claim'}
                </button>
            </div>

            {isAdding && (
                <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f8fafc' }}>
                    <form onSubmit={handleAddClaim}>
                        <div className="form-group">
                            <label className="form-label">Claim</label>
                            <textarea
                                className="form-textarea"
                                rows={2}
                                placeholder="Exact claim as stated or paraphrased..."
                                value={newClaimText}
                                onChange={(e) => setNewClaimText(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-select"
                                    value={newClaimType}
                                    onChange={(e) => setNewClaimType(e.target.value as ClaimType)}
                                >
                                    <option value="Factual">Factual</option>
                                    <option value="Statistical">Statistical</option>
                                    <option value="Historical">Historical</option>
                                    <option value="Attribution">Attribution</option>
                                    <option value="Identity">Identity</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Source</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Who said this?"
                                    value={newClaimSource}
                                    onChange={(e) => setNewClaimSource(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Priority</label>
                                <select
                                    className="form-select"
                                    value={newClaimPriority}
                                    onChange={(e) => setNewClaimPriority(e.target.value as Priority)}
                                >
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary">Save Claim</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
                {state.claims.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '3rem' }}>
                        No claims added yet. Extract claims from your story to begin verification.
                    </div>
                ) : (
                    state.claims.map((claim) => (
                        <ClaimCard key={claim.id} claim={claim} onDelete={() => removeClaim(claim.id)} onUpdate={updateClaim} />
                    ))
                )}
            </div>
        </div>
    );
}

function ClaimCard({ claim, onDelete, onUpdate }: { claim: Claim; onDelete: () => void; onUpdate: (c: Claim) => void }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Verified': return 'var(--color-success)';
            case 'False': return 'var(--color-danger)';
            case 'Disputed': return 'var(--color-warning)';
            default: return 'var(--color-text-secondary)';
        }
    };

    return (
        <div className="card" style={{ borderLeft: `4px solid ${getStatusColor(claim.status)}` }}>
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
                            {claim.type}
                        </span>
                        <span style={{
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            backgroundColor: claim.priority === 'Critical' ? '#fed7d7' : '#edf2f7',
                            color: claim.priority === 'Critical' ? '#c53030' : '#4a5568',
                            fontWeight: 600
                        }}>
                            {claim.priority} Priority
                        </span>
                    </div>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                        "{claim.text}"
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        Source: <strong>{claim.source}</strong>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select
                        className="form-select"
                        style={{ padding: '0.25rem', fontSize: '0.8rem', width: 'auto' }}
                        value={claim.status}
                        onChange={(e) => onUpdate({ ...claim, status: e.target.value as any })}
                    >
                        <option value="Unverified">Unverified</option>
                        <option value="Verified">Verified</option>
                        <option value="Disputed">Disputed</option>
                        <option value="False">False</option>
                        <option value="Unverifiable">Unverifiable</option>
                    </select>
                    <button className="btn btn-secondary" onClick={onDelete} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
