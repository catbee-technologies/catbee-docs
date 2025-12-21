import { useMotionValue, type MotionValue } from 'framer-motion';
import type { MouseEvent } from 'react';

export interface MouseTrackingOptions {
  /**
   * Initial X position as a percentage (0-100)
   * @default 50
   */
  initialX?: number;
  /**
   * Initial Y position as a percentage (0-100)
   * @default 50
   */
  initialY?: number;
  /**
   * Whether to reset to initial position on mouse leave
   * @default true
   */
  resetOnLeave?: boolean;
  /**
   * Smooth the tracking with a factor (0-1, where 1 is instant)
   * @default 1
   */
  smoothing?: number;
}

export interface MouseTrackingReturn {
  /**
   * Motion value for X position (0-100%)
   */
  mouseX: MotionValue<number>;
  /**
   * Motion value for Y position (0-100%)
   */
  mouseY: MotionValue<number>;
  /**
   * Handler for mouse move events
   */
  handleMouseMove: <T extends HTMLElement>(e: MouseEvent<T>) => void;
  /**
   * Handler for mouse leave events
   */
  handleMouseLeave: () => void;
  /**
   * Reset mouse position to initial values
   */
  reset: () => void;
}

/**
 * Custom hook for tracking mouse position within an element
 * Returns percentage-based coordinates (0-100) relative to the element
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { mouseX, mouseY, handleMouseMove, handleMouseLeave } = useMouseTracking({
 *     initialX: 50,
 *     initialY: 50,
 *     resetOnLeave: true
 *   });
 *
 *   return (
 *     <motion.div
 *       onMouseMove={handleMouseMove}
 *       onMouseLeave={handleMouseLeave}
 *       style={{
 *         '--mouse-x': useTransform(mouseX, v => `${v}%`),
 *         '--mouse-y': useTransform(mouseY, v => `${v}%`)
 *       } as React.CSSProperties}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 */
export default function useMouseTracking(options: MouseTrackingOptions = {}): MouseTrackingReturn {
  const { initialX = 50, initialY = 50, resetOnLeave = true, smoothing = 1 } = options;

  const mouseX = useMotionValue(initialX);
  const mouseY = useMotionValue(initialY);

  const handleMouseMove = <T extends HTMLElement>(e: MouseEvent<T>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (smoothing === 1) {
      mouseX.set(x);
      mouseY.set(y);
    } else {
      // Smooth interpolation
      const currentX = mouseX.get();
      const currentY = mouseY.get();
      mouseX.set(currentX + (x - currentX) * smoothing);
      mouseY.set(currentY + (y - currentY) * smoothing);
    }
  };

  const reset = () => {
    mouseX.set(initialX);
    mouseY.set(initialY);
  };

  const handleMouseLeave = () => {
    if (resetOnLeave) {
      reset();
    }
  };

  return {
    mouseX,
    mouseY,
    handleMouseMove,
    handleMouseLeave,
    reset
  };
}
