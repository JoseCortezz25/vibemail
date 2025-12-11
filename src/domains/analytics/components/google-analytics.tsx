import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

/**
 * Google Analytics component for tracking user interactions
 * Server Component - Optimized for performance
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Don't render if GA ID is not configured
  if (!gaId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Analytics] NEXT_PUBLIC_GA_MEASUREMENT_ID is not set. Google Analytics will not be loaded.'
      );
    }
    return null;
  }

  return <NextGoogleAnalytics gaId={gaId} />;
}
