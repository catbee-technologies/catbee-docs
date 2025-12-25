import { type ReactNode, useEffect, useRef, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomePage from '../components/HomePage';
import Features from '../components/Features';
import Packages from '../components/Packages';
import GetStarted from '../components/GetStarted';
import clsx from 'clsx';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  const SHOW_AFTER = 300; // Show button after 300px scroll

  const [showGoTop, setShowGoTop] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingUp = currentY < lastScrollY.current;
      const nearTop = currentY < SHOW_AFTER;
      if (scrollingUp && !nearTop) setShowGoTop(true);
      else setShowGoTop(false);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout title={`${siteConfig.title}`} description='Documentation for Catbee Packages and Tools'>
      <HomePage />
      <main>
        <Features />
        <Packages />
        <GetStarted />
      </main>
      <button
        onClick={handleGoTop}
        aria-label='Go to top'
        className={clsx('clean-btn', 'catbeeToTopButton', showGoTop && 'catbeeToTopButtonShow')}
      />
    </Layout>
  );
}
