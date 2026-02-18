import { useRef } from 'react';
import { useJournalistStore } from './hooks/useJournalistStore';
import { StoryIntake } from './components/StoryIntake';
import { ClaimManager } from './components/ClaimManager';
import { SourceEvaluator } from './components/SourceEvaluator';
import { FactCheckLog } from './components/FactCheckLog';
import { RedFlagScanner } from './components/RedFlagScanner';
import { FinalReport } from './components/FinalReport';
import { testData } from './data/testData';

function App() {
  const { state, resetStory, loadTestData } = useJournalistStore();
  const claimsRef = useRef<HTMLDivElement>(null);
  const sourcesRef = useRef<HTMLDivElement>(null);
  const verifyRef = useRef<HTMLDivElement>(null);
  const redflagsRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const { currentStory } = state;

  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!currentStory) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>
            Journalist<span style={{ color: 'var(--color-accent)' }}>Research</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Rigorous verification and fact-checking workflow
          </p>
        </header>
        <StoryIntake onComplete={() => { }} />

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => loadTestData(testData)}
            style={{
              background: 'transparent',
              border: '1px dashed var(--color-border)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Load Test Data (Rising Homelessness Story)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'var(--color-bg-primary)', paddingBottom: '1rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', paddingTop: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>
              {currentStory.title}
            </h1>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Deadline: {currentStory.deadline} &bull; {currentStory.sensitivity}
            </span>
          </div>
          <div>
            <button className="btn btn-secondary" onClick={resetStory} style={{ fontSize: '0.75rem' }}>
              New Story
            </button>
          </div>
        </header>

        <nav style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingTop: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <NavButton onClick={() => scrollToSection(claimsRef)}>
            1. Claims
          </NavButton>
          <NavButton onClick={() => scrollToSection(sourcesRef)}>
            2. Sources
          </NavButton>
          <NavButton onClick={() => scrollToSection(verifyRef)}>
            3. Verification
          </NavButton>
          <NavButton onClick={() => scrollToSection(redflagsRef)}>
            4. Red Flags
          </NavButton>
          <NavButton onClick={() => scrollToSection(reportRef)}>
            5. Report
          </NavButton>
        </nav>
      </div>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        <section ref={claimsRef} id="claims">
          <h2 style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>1. Claims Analysis</h2>
          <ClaimManager />
        </section>

        <section ref={sourcesRef} id="sources">
          <h2 style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>2. Source Evaluation</h2>
          <SourceEvaluator />
        </section>

        <section ref={verifyRef} id="verify">
          <h2 style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>3. Verification Log</h2>
          <FactCheckLog />
        </section>

        <section ref={redflagsRef} id="redflags">
          <h2 style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>4. Red Flag Scanner</h2>
          <RedFlagScanner />
        </section>

        <section ref={reportRef} id="report">
          <h2 style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>5. Final Report</h2>
          <FinalReport />
        </section>
      </main>
    </div>
  );
}

function NavButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)',
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </button>
  );
}

export default App;
