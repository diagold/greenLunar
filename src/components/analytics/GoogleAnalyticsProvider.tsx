
import { GoogleAnalytics } from "@next/third-parties/google";

export default function GoogleAnalyticsProvider() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
