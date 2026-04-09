import { useState } from 'react';
import Navbar from './components/Landing/Navbar';
import Hero from './components/Landing/Hero';
import SystemDesign from './components/Landing/SystemDesign';
import Features from './components/Landing/Features';
import DemoSection from './components/Landing/DemoSection';
import CTASection from './components/Landing/CTASection';
import Footer from './components/Landing/Footer';
import EditorPage from './components/Editor/EditorPage';

function App() {
  const [page, setPage] = useState<'landing' | 'editor'>('landing');

  if (page === 'editor') {
    return <EditorPage onBack={() => setPage('landing')} />;
  }

  return (
    <>
      <Navbar />
      <Hero />
      <div className="min-h-screen bg-surface-950">
        <SystemDesign />
        <Features />
        <DemoSection onOpenEditor={() => setPage('editor')} />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}

export default App;
