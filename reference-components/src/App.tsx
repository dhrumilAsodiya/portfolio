import { useCallback, useEffect, useState } from 'react';
import CrowdFinale from './components/CrowdFinale';
import SpiderPage from './pages/SpiderPage';

type Route = 'crowd' | 'spider';

function readRouteFromLocation(): Route {
  if (typeof window === 'undefined') return 'crowd';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path.startsWith('/spider') || hash.includes('spider')) {
    return 'spider';
  }
  return 'crowd';
}

export default function App() {
  const [route, setRoute] = useState<Route>(readRouteFromLocation);

  const navigate = useCallback((next: Route) => {
    const targetPath = next === 'spider' ? '/spider' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ route: next }, '', targetPath);
    }
    setRoute(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setRoute(readRouteFromLocation());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onPopState);
    };
  }, []);

  useEffect(() => {
    document.title =
      route === 'spider'
        ? 'Hanging Spider — Interactive Page'
        : 'See You Around — Crowd Scene';
  }, [route]);

  if (route === 'spider') {
    return <SpiderPage onNavigateCrowd={() => navigate('crowd')} />;
  }

  return (
    <main className="flex min-h-screen w-full flex-col justify-center bg-black text-white">
      <CrowdFinale onNavigateSpider={() => navigate('spider')} />
    </main>
  );
}
