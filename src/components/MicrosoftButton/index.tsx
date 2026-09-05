import type { ReactNode } from 'react';
import Button from '../Button';
import styles from './index.module.scss';

interface MicrosoftButtonProps {
  className?: string;
}

export default function MicrosoftButton({ className }: Readonly<MicrosoftButtonProps>): ReactNode {
  return (
    <Button
      href='https://apps.microsoft.com/detail/9NX6H3J2RNX2?referrer=appbadge&mode=full'
      target='_blank'
      rel='noopener noreferrer'
      variant='primary'
      className={`${styles.microsoftButton} ${className ?? ''}`}
    >
      <span className={styles.microsoftLogo} aria-hidden='true'>
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className={styles.microsoftLabel}>
        <small>Download from the</small>
        <strong>Microsoft Store</strong>
      </span>
    </Button>
  );
}
