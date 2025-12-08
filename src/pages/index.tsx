import { type ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomePage from '../components/HomePage';
import Features from '../components/Features';
import Packages from '../components/Packages';
import GetStarted from '../components/GetStarted';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={`${siteConfig.title}`} description='Documentation for Catbee Packages and Tools'>
      <HomePage />
      <main>
        <Features />
        <Packages />
        <GetStarted />
      </main>
    </Layout>
  );
}
