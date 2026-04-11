import { useEffect, useState } from 'react';
import Navbar from './components/Landing/Navbar';
import Hero from './components/Landing/Hero';
import Features from './components/Landing/Features';
import DemoSection from './components/Landing/DemoSection';
import CTASection from './components/Landing/CTASection';
import Footer from './components/Landing/Footer';
import ShowcasePage from './components/Landing/ShowcasePage';
import { showcases } from './content/showcases';

function getActiveShowcaseSlug() {
  if (typeof window === 'undefined') {
    return null;
  }

  const match = window.location.hash.match(/^#showcase\/(.+)$/);
  return match?.[1] ?? null;
}

function App() {
  const [activeShowcaseSlug, setActiveShowcaseSlug] = useState<string | null>(getActiveShowcaseSlug());

  useEffect(() => {
    const handleHashChange = () => {
      setActiveShowcaseSlug(getActiveShowcaseSlug());
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeShowcase = showcases.find((item) => item.slug === activeShowcaseSlug) ?? null;

  return (
    <>
      <Navbar />
      {activeShowcase ? (
        <ShowcasePage showcase={activeShowcase} />
      ) : (
        <>
          <Hero />
          <div className="min-h-screen bg-surface-950">
            <Features />
            <DemoSection />
            <CTASection />
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default App;
