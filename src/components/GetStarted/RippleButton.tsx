import { useState, MouseEvent } from 'react';
import clsx from 'clsx';
import styles from './RippleButton.module.scss';

interface RippleButtonProps {
  children: React.ReactNode;
  href?: string;
  target?: string;
  className?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export default function RippleButton({
  children,
  href,
  target,
  className,
  variant = 'primary',
  onClick
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = (event: MouseEvent<HTMLAnchorElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prevRipples => [...prevRipples, newRipple]);

    setTimeout(() => {
      setRipples(prevRipples => prevRipples.filter(r => r.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  const Element = href ? 'a' : 'button';

  return (
    <Element
      href={href}
      target={target}
      className={clsx(
        'button button--lg',
        styles.rippleButton,
        variant === 'primary' ? styles.primary : styles.secondary,
        className
      )}
      onClick={createRipple as () => void}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className={styles.ripple}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
        />
      ))}
    </Element>
  );
}
