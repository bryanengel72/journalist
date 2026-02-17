import { useJournalistStore } from '../hooks/useJournalistStore';
import type { Claim } from '../types';

export function RedFlagScanner() {
    const { state } = useJournalistStore();

    const getStatisticalRedFlags = (claims: Claim[]) => {
        const statsClaims = claims.filter(c => c.type === 'Statistical');
        const flags = [];

        for (const claim of statsClaims) {
            const text = claim.text.toLowerCase();
            if (text.includes('percent') || text.includes('%')) {
                if (!text.includes('compare') && !text.includes('from') && !text.includes('base')) {
                    flags.push({ claim, issue: 'Percentage without clear baseline?' });
                }
            }
            if (text.includes('average') && !text.includes('median') && !text.includes('mean')) {
                flags.push({ claim, issue: 'Average used - check if mean vs median matters.' });
            }
            if (text.includes('up to') || text.includes('as much as')) {
                flags.push({ claim, issue: 'Weasel words "up to" detected.' });
            }
        }
        return flags;
    };

    const getAttributionRedFlags = (claims: Claim[]) => {
        const attrClaims = claims.filter(c => c.type === 'Attribution');
        const flags = [];

        for (const claim of attrClaims) {
            const source = claim.source.toLowerCase();
            if (source.includes('expert') || source.includes('official') || source.includes('source')) {
                if (source.split(' ').length < 3) { // Rough heuristic for vague source
                    flags.push({ claim, issue: 'Vague attribution detected ("Experts", "Officials").' });
                }
            }
        }
        return flags;
    };

    const statsFlags = getStatisticalRedFlags(state.claims);
    const attrFlags = getAttributionRedFlags(state.claims);

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h3>Red Flag Scanner</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Automated analysis of your extracted claims for common journalistic pitfalls.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                <section>
                    <h4 style={{ borderBottom: '2px solid var(--color-warning)', display: 'inline-block', marginBottom: '1rem' }}>
                        Statistical Hazards
                    </h4>
                    {statsFlags.length === 0 ? (
                        <p style={{ color: 'var(--color-success)', fontStyle: 'italic' }}>No obvious statistical red flags detected in current claims.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {statsFlags.map((flag, idx) => (
                                <li key={idx} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--color-warning)' }}>
                                    <p style={{ fontWeight: 600, color: 'var(--color-warning)', marginBottom: '0.5rem' }}>{flag.issue}</p>
                                    <p>"{flag.claim.text}"</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section>
                    <h4 style={{ borderBottom: '2px solid var(--color-danger)', display: 'inline-block', marginBottom: '1rem' }}>
                        Attribution & Vague Sources
                    </h4>
                    {attrFlags.length === 0 ? (
                        <p style={{ color: 'var(--color-success)', fontStyle: 'italic' }}>No obvious attribution red flags detected.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {attrFlags.map((flag, idx) => (
                                <li key={idx} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--color-danger)' }}>
                                    <p style={{ fontWeight: 600, color: 'var(--color-danger)', marginBottom: '0.5rem' }}>{flag.issue}</p>
                                    <p>"{flag.claim.text}"</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Source: {flag.claim.source}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <div className="card" style={{ marginTop: '2rem', backgroundColor: '#fffaf0', border: '1px solid #fbd38d' }}>
                <h4>Manual Checklist</h4>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Do percent changes include the base numbers? (e.g., "up 50% from 10 to 15")</li>
                    <li style={{ marginBottom: '0.5rem' }}>Are comparisons apples-to-apples? (Same time period, same methodology?)</li>
                    <li style={{ marginBottom: '0.5rem' }}>Does "Record High" account for inflation or population growth?</li>
                    <li style={{ marginBottom: '0.5rem' }}>Is the "Expert" actually an expert in <em>this specific field</em>?</li>
                </ul>
            </div>
        </div>
    );
}
