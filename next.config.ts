import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next.js doesn't infer it from
  // the lockfile in the home directory.
  turbopack: {
    root: __dirname,
  },
  // Ensure the tool HTML (read at runtime by app/vaerktoej) is bundled with
  // the serverless function in production.
  outputFileTracingIncludes: {
    "/vaerktoej": ["./content/**"],
  },
};

export default nextConfig;
