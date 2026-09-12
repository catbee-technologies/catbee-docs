import type { ReactNode } from 'react';
import Button from '../Button';
import styles from './index.module.scss';

interface MicrosoftButtonProps {
  productId: string;
  className?: string;
}

const getMicrosoftStoreUrl = (id: string) => `https://apps.microsoft.com/detail/${id}?referrer=appbadge&mode=full`;

export default function MicrosoftButton({ className, productId }: Readonly<MicrosoftButtonProps>): ReactNode {
  return (
    <Button
      href={getMicrosoftStoreUrl(productId)}
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
