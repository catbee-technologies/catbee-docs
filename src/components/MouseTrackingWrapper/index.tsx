import type { ReactNode, ComponentProps } from 'react';
import { motion, useTransform } from 'framer-motion';
import useMouseTracking, { type MouseTrackingOptions } from '@site/src/hooks/useMouseTracking';

export interface MouseTrackingWrapperProps extends MouseTrackingOptions {
  /**
   * Child component to render with mouse tracking
   */
  children: ReactNode;
  /**
   * Class name to apply to the wrapper
   */
  className?: string;
  /**
   * Additional motion.div props
   */
  motionProps?: Omit<ComponentProps<typeof motion.div>, 'onMouseMove' | 'onMouseLeave' | 'style' | 'children'>;
  /**
   * Additional inline styles (will be merged with mouse tracking CSS variables)
   */
  style?: React.CSSProperties;
  /**
   * Format function for CSS variable values
   * @default (v) => `${v}%`
   */
  formatValue?: (value: number) => string;
  /**
   * Custom CSS variable names
   * @default { x: '--mouse-x', y: '--mouse-y' }
   */
  cssVarNames?: {
    x?: string;
    y?: string;
  };
}

/**
 * Wrapper component that automatically adds mouse tracking capabilities
 * Exposes mouse position as CSS custom properties (--mouse-x and --mouse-y)
 *
 * @example
 * ```tsx
 * <MouseTrackingWrapper
 *   className="my-card"
 *   initialX={50}
 *   initialY={50}
 *   resetOnLeave={true}
 * >
 *   <div className="content">
 *     Hover over me!
 *   </div>
 * </MouseTrackingWrapper>
 * ```
 *
 * Then in your CSS/SCSS:
 * ```scss
 * .my-card {
 *   &::after {
 *     background: radial-gradient(
 *       circle at var(--mouse-x) var(--mouse-y),
 *       rgba(106, 79, 188, 0.2),
 *       transparent
 *     );
 *   }
 * }
 * ```
 */
export default function MouseTrackingWrapper({
  children,
  className,
  motionProps = {},
  style = {},
  formatValue = v => `${v}%`,
  cssVarNames = {},
  ...trackingOptions
}: Readonly<MouseTrackingWrapperProps>): ReactNode {
  const { mouseX, mouseY, handleMouseMove, handleMouseLeave } = useMouseTracking(trackingOptions);

  const xVarName = cssVarNames.x || '--mouse-x';
  const yVarName = cssVarNames.y || '--mouse-y';

  return (
    <motion.div
      {...motionProps}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          ...style,
          [xVarName]: useTransform(mouseX, formatValue),
          [yVarName]: useTransform(mouseY, formatValue)
        } as React.CSSProperties
      }
    >
      {children}
    </motion.div>
  );
}
