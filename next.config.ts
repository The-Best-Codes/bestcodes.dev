// BotID is disabled. To re-enable it, uncomment the lines marked "BotID" here,
// in instrumentation-client.ts, and in app/api/contact/route.ts.
// import { withBotId } from "botid/next/config"; // BotID
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [10, 25],
    // Cache optimized images for 31 days (Next's default is 4 hours) so Vercel
    // re-optimizes them far less often.
    minimumCacheTTL: 2678400,
    // Content never renders wider than ~1024px, so the 3840 default only adds
    // more possible transformations.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Only allow hosts we actually use; "*" lets anyone run arbitrary images
    // through (and bill) our optimizer.
    remotePatterns: [new URL("https://dev-to-uploads.s3.amazonaws.com/**")],
  },
};

export default nextConfig;
// export default withBotId(nextConfig); // BotID
