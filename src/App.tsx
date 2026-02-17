import { useState } from 'react';
import { useJournalistStore } from './hooks/useJournalistStore';
import { StoryIntake } from './components/StoryIntake';
import { ClaimManager } from './components/ClaimManager';
import { SourceEvaluator } from './components/SourceEvaluator';
import { FactCheckLog } from './components/FactCheckLog';
import { RedFlagScanner } from './components/RedFlagScanner';
import { FinalReport } from './components/FinalReport';

type Phase = 'intake' | 'claims' | 'sources' | 'verify' | 'redflags' | 'report';

function App() {
  const { state, resetStory } = useJournalistStore();
  const [currentPhase, setCurrentPhase] = useState<Phase>('claims');

  const { currentStory } = state;

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
        <StoryIntake onComplete={() => setCurrentPhase('claims')} />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
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

      <nav style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <NavButton active={currentPhase === 'claims'} onClick={() => setCurrentPhase('claims')}>
          1. Claims
        </NavButton>
        <NavButton active={currentPhase === 'sources'} onClick={() => setCurrentPhase('sources')}>
          2. Sources
        </NavButton>
        <NavButton active={currentPhase === 'verify'} onClick={() => setCurrentPhase('verify')}>
          3. Verification
        </NavButton>
        <NavButton active={currentPhase === 'redflags'} onClick={() => setCurrentPhase('redflags')}>
          4. Red Flags
        </NavButton>
        <NavButton active={currentPhase === 'report'} onClick={() => setCurrentPhase('report')}>
          5. Report
        </NavButton>
      </nav>

      <main>
        {currentPhase === 'claims' && <ClaimManager />}
        {currentPhase === 'sources' && <SourceEvaluator />}
        {currentPhase === 'verify' && <FactCheckLog />}
        {currentPhase === 'redflags' && <RedFlagScanner />}
        {currentPhase === 'report' && <FinalReport />}
      </main>
    </div>
  );
}

function NavButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        backgroundColor: active ? 'var(--color-accent)' : 'transparent',
        color: active ? 'white' : 'var(--color-text-secondary)',
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
