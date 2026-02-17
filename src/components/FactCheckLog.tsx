import { useState } from 'react';
import { useJournalistStore } from '../hooks/useJournalistStore';
import type { Claim, VerificationLog, ClaimStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function FactCheckLog() {
    const { state, updateClaim } = useJournalistStore();

    // Filter for higher priority claims or all? The skill says "Critical or High Priority"
    const priorityClaims = state.claims.filter(
        (c) => c.priority === 'Critical' || c.priority === 'High'
    );

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h3>Verification Log</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Systematic verification for Critical and High priority claims.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {priorityClaims.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                        No Critical or High priority claims found. Add high-stakes claims in the Claims tab to verify them here.
                    </div>
                ) : (
                    priorityClaims.map((claim) => (
                        <VerificationItem key={claim.id} claim={claim} onUpdate={updateClaim} />
                    ))
                )}
            </div>
        </div>
    );
}

function VerificationItem({ claim, onUpdate }: { claim: Claim; onUpdate: (c: Claim) => void }) {
    const [isLogging, setIsLogging] = useState(false);
    const [method, setMethod] = useState('');
    const [finding, setFinding] = useState('');
    const [sourceFound, setSourceFound] = useState('');

    const handleAddLog = (e: React.FormEvent) => {
        e.preventDefault();
        const newLog: VerificationLog = {
            id: uuidv4(),
            claimId: claim.id,
            method,
            sourcesFound: [sourceFound],
            finding,
            verdict: 'Verified', // Default, user should probably select
            confidence: 'High',
            timestamp: Date.now(),
        };

        // Auto-update claim status based on finding? Let's just append log for now.
        // Actually, let's allow user to update status in the log form or just keep using the main status.
        const updatedClaim = {
            ...claim,
            verificationLogs: [...claim.verificationLogs, newLog]
        };
        onUpdate(updatedClaim);
        setIsLogging(false);
        setMethod('');
        setFinding('');
        setSourceFound('');
    };

    return (
        <div className="card">
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{
                        fontWeight: 600,
                        color: claim.priority === 'Critical' ? 'var(--color-danger)' : 'var(--color-warning)',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase'
                    }}>
                        {claim.priority} Priority
                    </span>
                    <span style={{
                        fontWeight: 600,
                        color: claim.status === 'Verified' ? 'var(--color-success)' : 'var(--color-text-secondary)',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase'
                    }}>
                        {claim.status}
                    </span>
                </div>
                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>"{claim.text}"</p>
            </div>

            {/* Existing Logs */}
            {claim.verificationLogs.length > 0 && (
                <div style={{ marginBottom: '1rem', backgroundColor: '#f7fafc', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Verification Trail</h5>
                    <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.875rem' }}>
                        {claim.verificationLogs.map(log => (
                            <li key={log.id} style={{ marginBottom: '0.5rem' }}>
                                <strong>{log.method}:</strong> {log.finding} <br />
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Source: {log.sourcesFound.join(', ')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Action Area */}
            <div>
                {!isLogging ? (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-secondary" onClick={() => setIsLogging(true)}>+ Add Verification Step</button>
                        {claim.status !== 'Verified' && (
                            <button className="btn btn-primary" onClick={() => onUpdate({ ...claim, status: 'Verified' })}>Mark as Verified</button>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleAddLog} style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                        <div className="form-group">
                            <label className="form-label">Method</label>
                            <select className="form-select" value={method} onChange={(e) => setMethod(e.target.value)} required>
                                <option value="">Select Method...</option>
                                <option value="Public Record Search">Public Record Search</option>
                                <option value="Official Statement">Official Statement</option>
                                <option value="Direct Outreach">Direct Outreach</option>
                                <option value="Academic Database">Academic Database</option>
                                <option value="News Archive">News Archive</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Source Found</label>
                            <input className="form-input" placeholder="URL or Document Name" value={sourceFound} onChange={(e) => setSourceFound(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Finding</label>
                            <textarea className="form-textarea" rows={2} placeholder="What did the evidence show?" value={finding} onChange={(e) => setFinding(e.target.value)} required />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setIsLogging(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Log Verification</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
