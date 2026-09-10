import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

if (typeof window !== 'undefined') {
  injectAnalytics();
  injectSpeedInsights();
}
