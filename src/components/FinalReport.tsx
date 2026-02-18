import { useState } from 'react';
import { useJournalistStore } from '../hooks/useJournalistStore';

export function FinalReport() {
    const { state } = useJournalistStore();
    const [checklist, setChecklist] = useState({
        criticalClaims: false,
        namedRoles: false,
        statistics: false,
        quotes: false,
        conflicts: false,
        anonymous: false,
        spellcheck: false,
        causality: false
    });

    const toggleCheck = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const allChecked = Object.values(checklist).every(Boolean);

    const verificationRate = state.claims.length > 0
        ? Math.round((state.claims.filter(c => c.status === 'Verified').length / state.claims.length) * 100)
        : 0;

    const generateReport = () => {
        if (!state.currentStory) return;

        const date = new Date().toISOString().split('T')[0];
        const reportContent = `
# Verification Report: ${state.currentStory.title}
Date: ${date}
Status: ${allChecked ? 'READY FOR PUBLICATION' : 'CHECKS INCOMPLETE'}

## Story Details
Summary: ${state.currentStory.summary}
Deadline: ${state.currentStory.deadline}
Sensitivity: ${state.currentStory.sensitivity}

## Verification Statistics
- Total Claims: ${state.claims.length}
- Verified Rate: ${verificationRate}%
- Open Critical Issues: ${state.claims.filter(c => c.priority === 'Critical' && c.status !== 'Verified').length}

## Claims Analysis
${state.claims.map(c => `
- [${c.status.toUpperCase()}] ${c.text}
  Priority: ${c.priority}
  Type: ${c.type}
  Source: ${c.source}
  Notes: ${c.notes}
`).join('')}

## Source Evaluation
${state.sources.map(s => `
- ${s.name} (${s.type})
  Credibility: ${s.assessment}
  Corroborated: ${s.corroborated}
  Notes: ${s.notes}
`).join('')}

## Pre-Publication Checklist
${Object.entries(checklistLabels).map(([key, label]) => `
- [${checklist[key as keyof typeof checklist] ? 'x' : ' '}] ${label}
`).join('')}
        `.trim();

        const blob = new Blob([reportContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `verification-report-${state.currentStory.id.substring(0, 8)}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h3>Pre-Publication Review</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Final readiness check before filing the story.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                <div>
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h4 style={{ marginTop: 0 }}>Step 1: Session Stats</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{state.claims.length}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Total Claims</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent)' }}>{verificationRate}%</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Verified Rate</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-warning)' }}>
                                    {state.claims.filter(c => c.priority === 'Critical' && c.status !== 'Verified').length}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Open Critical Issues</div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Step 2: The Checklist</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {Object.entries(checklistLabels).map(([key, label]) => (
                                <li key={key} style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <input
                                        type="checkbox"
                                        style={{ marginTop: '0.25rem' }}
                                        checked={checklist[key as keyof typeof checklist]}
                                        onChange={() => toggleCheck(key as keyof typeof checklist)}
                                    />
                                    <label onClick={() => toggleCheck(key as keyof typeof checklist)} style={{ cursor: 'pointer', lineHeight: 1.4 }}>
                                        {label}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div style={{ alignSelf: 'start' }}>
                    <div className="card" style={{ borderColor: allChecked ? 'var(--color-success)' : 'var(--color-border)' }}>
                        <h4 style={{ marginTop: 0 }}>Readiness Status</h4>

                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem 0',
                            marginBottom: '1rem',
                            color: allChecked ? 'var(--color-success)' : 'var(--color-text-secondary)'
                        }}>
                            {allChecked ? (
                                <>
                                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>✓</span>
                                    <strong>Ready to Publish</strong>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>Wait</span>
                                    <strong>Checks Incomplete</strong>
                                </>
                            )}
                        </div>

                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                            Ensure all items are checked before generating the report.
                        </p>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={!allChecked}
                            onClick={generateReport}
                        >
                            Generate Final Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const checklistLabels = {
    criticalClaims: "All critical claims have a verification status",
    namedRoles: "Every named individual's title/role has been confirmed",
    statistics: "All statistics cite a specific source, date, and methodology",
    quotes: "All direct quotes are accurately attributed and in context",
    conflicts: "Conflicting evidence has been acknowledged or addressed",
    anonymous: "No anonymous-source claims regarding verifyable on-record facts",
    spellcheck: "Legal names, place names, and dates spell-checked",
    causality: "Story does not make causal claims beyond evidence"
};
