import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react';
import Navbar from './components/Landing/Navbar';
import Hero from './components/Landing/Hero';
import Features from './components/Landing/Features';
import DemoSection from './components/Landing/DemoSection';
import CTASection from './components/Landing/CTASection';
import Footer from './components/Landing/Footer';
import DesktopCompanion from './components/Desktop/DesktopCompanion';
import ShowcasePage from './components/Landing/ShowcasePage';
import ProjectDetailPage from './components/Landing/ProjectDetailPage';
import { showcaseMediaBySlug, showcases } from './content/showcases';

const clickEmojis = ['✨', '💫', '🌟', '🎨', '🫧', '💥', '🌈', '🍀', '💖', '🎵'];

type EmojiBurst = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
  size: number;
};

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

function isDesktopMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  return new URLSearchParams(window.location.search).get('desktop') === '1';
}

function App() {
  const desktopMode = isDesktopMode();
  const [routeState, setRouteState] = useState(getRouteState());
  const [emojiBursts, setEmojiBursts] = useState<EmojiBurst[]>([]);

  useEffect(() => {
    if (desktopMode) {
      return undefined;
    }

    const handleHashChange = () => {
      setRouteState(getRouteState());
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [desktopMode]);

  useEffect(() => {
    if (desktopMode || !emojiBursts.length) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setEmojiBursts((current) => current.slice(6));
    }, 900);

    return () => window.clearTimeout(timer);
  }, [desktopMode, emojiBursts]);

  useEffect(() => {
    if (!desktopMode) {
      return undefined;
    }

    const previousBodyBackground = document.body.style.background;
    const previousRootBackground = document.documentElement.style.background;

    document.body.style.background = 'transparent';
    document.documentElement.style.background = 'transparent';

    return () => {
      document.body.style.background = previousBodyBackground;
      document.documentElement.style.background = previousRootBackground;
    };
  }, [desktopMode]);

  const activeShowcase = showcases.find((item) => item.slug === routeState.showcaseSlug) ?? null;
  const activeProject = activeShowcase && routeState.projectId
    ? (showcaseMediaBySlug[activeShowcase.slug] ?? []).find((item) => item.id === routeState.projectId) ?? null
    : null;

  const handleBackgroundClick = (event: MouseEvent<HTMLDivElement>) => {
    if (desktopMode) {
      return;
    }

    const target = event.target as HTMLElement;
    const interactiveTarget = target.closest(
      'a, button, input, textarea, select, label, summary, video, img, [role="button"]',
    );

    if (interactiveTarget) {
      return;
    }

    const chosenEmojis = [...clickEmojis]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    const nextBursts = chosenEmojis.map((emoji, index) => ({
      id: Date.now() + index + Math.random(),
      emoji,
      x: event.clientX,
      y: event.clientY,
      dx: (Math.random() - 0.5) * 140,
      dy: -40 - Math.random() * 110,
      rotate: (Math.random() - 0.5) * 90,
      size: 18 + Math.random() * 14,
    }));

    setEmojiBursts((current) => [...current, ...nextBursts].slice(-30));
  };

  if (desktopMode) {
    return <DesktopCompanion />;
  }

  return (
    <div onClick={handleBackgroundClick}>
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
      <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
        {emojiBursts.map((burst) => (
          <span
            key={burst.id}
            className="emoji-burst"
            style={{
              left: burst.x,
              top: burst.y,
              '--emoji-dx': `${burst.dx}px`,
              '--emoji-dy': `${burst.dy}px`,
              '--emoji-rotate': `${burst.rotate}deg`,
              '--emoji-size': `${burst.size}px`,
            } as CSSProperties}
          >
            {burst.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
