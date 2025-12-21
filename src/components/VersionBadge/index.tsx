import type { ReactNode } from 'react';
import styles from './index.module.scss';

export default function VersionBadge({ version }: Readonly<{ version: string }>): ReactNode {
  return <div className={styles.versionBadge}>{version}</div>;
}
