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
import MoreGalleryPage from './components/Landing/MoreGalleryPage';
import { showcaseMediaBySlug, showcases } from './content/showcases';

const clickEmojis = ['✨', '💫', '🌟', '🎨', '🫧', '💥', '🌈', '🍀', '💖', '🎵'];
const clickBlessings = [
  '欢迎光临',
  '哇，你又变帅了！',
  '今天也灵感满格',
  '祝你灵感大爆发',
  '好审美正在发生',
  '你今天状态很好',
  '这次一定有惊喜',
  '你的创意被看见了',
];

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

type BlessingBurst = {
  id: number;
  text: string;
  emoji: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
};

function getRouteState() {
  if (typeof window === 'undefined') {
    return {
      page: null,
      showcaseSlug: null,
      projectId: null,
    };
  }

  if (window.location.hash === '#more-gallery') {
    return {
      page: 'more-gallery',
      showcaseSlug: null,
      projectId: null,
    };
  }

  const projectMatch = window.location.hash.match(/^#showcase\/([^/]+)\/project\/([^/]+)$/);

  if (projectMatch) {
    return {
      page: null,
      showcaseSlug: projectMatch[1] ?? null,
      projectId: projectMatch[2] ?? null,
    };
  }

  const showcaseMatch = window.location.hash.match(/^#showcase\/([^/]+)$/);

  return {
    page: null,
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
  const [blessingBursts, setBlessingBursts] = useState<BlessingBurst[]>([]);

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
    if (desktopMode || !blessingBursts.length) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setBlessingBursts((current) => current.slice(1));
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [desktopMode, blessingBursts]);

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
  const activeStandalonePage = routeState.page;

  const handleBackgroundClick = (event: MouseEvent<HTMLDivElement>) => {
    if (desktopMode || activeStandalonePage) {
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
      .slice(0, 4);
    const leadEmoji = chosenEmojis[0] ?? '✨';
    const blessing = clickBlessings[Math.floor(Math.random() * clickBlessings.length)] ?? '欢迎光临';

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

    const nextBlessing = {
      id: Date.now() + Math.random(),
      text: blessing,
      emoji: leadEmoji,
      x: event.clientX,
      y: event.clientY,
      dx: (Math.random() - 0.5) * 28,
      dy: -78 - Math.random() * 44,
      rotate: (Math.random() - 0.5) * 10,
    };

    setEmojiBursts((current) => [...current, ...nextBursts].slice(-30));
    setBlessingBursts((current) => [...current, nextBlessing].slice(-8));
  };

  if (desktopMode) {
    return <DesktopCompanion />;
  }

  return (
    <div onClick={handleBackgroundClick}>
      <Navbar />
      {activeStandalonePage === 'more-gallery' ? (
        <MoreGalleryPage />
      ) : activeShowcase && activeProject ? (
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
        {blessingBursts.map((burst) => (
          <span
            key={burst.id}
            className="blessing-burst"
            style={{
              left: burst.x,
              top: burst.y,
              '--blessing-dx': `${burst.dx}px`,
              '--blessing-dy': `${burst.dy}px`,
              '--blessing-rotate': `${burst.rotate}deg`,
            } as CSSProperties}
          >
            <span>{burst.emoji}</span>
            <span>{burst.text}</span>
          </span>
        ))}
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
