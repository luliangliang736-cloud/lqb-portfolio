import { useEffect, useState } from 'react';
import Navbar from './components/Landing/Navbar';
import Hero from './components/Landing/Hero';
import Features from './components/Landing/Features';
import DemoSection from './components/Landing/DemoSection';
import CTASection from './components/Landing/CTASection';
import Footer from './components/Landing/Footer';
import ShowcasePage from './components/Landing/ShowcasePage';
import ProjectDetailPage from './components/Landing/ProjectDetailPage';
import { showcaseMediaBySlug, showcases } from './content/showcases';

function getRouteState() {
  if (typeof window === 'undefined') {
    return {
      showcaseSlug: null,
      projectId: null,
    };
  }

  const projectMatch = window.location.hash.match(/^#showcase\/([^/]+)\/project\/([^/]+)$/);

  if (projectMatch) {
    return {
      showcaseSlug: projectMatch[1] ?? null,
      projectId: projectMatch[2] ?? null,
    };
  }

  const showcaseMatch = window.location.hash.match(/^#showcase\/([^/]+)$/);

  return {
    showcaseSlug: showcaseMatch?.[1] ?? null,
    projectId: null,
  };
}

function App() {
  const [routeState, setRouteState] = useState(getRouteState());

  useEffect(() => {
    const handleHashChange = () => {
      setRouteState(getRouteState());
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeShowcase = showcases.find((item) => item.slug === routeState.showcaseSlug) ?? null;
  const activeProject = activeShowcase && routeState.projectId
    ? (showcaseMediaBySlug[activeShowcase.slug] ?? []).find((item) => item.id === routeState.projectId) ?? null
    : null;

  return (
    <>
      <Navbar />
      {activeShowcase && activeProject ? (
        <ProjectDetailPage showcase={activeShowcase} project={activeProject} />
      ) : activeShowcase ? (
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
