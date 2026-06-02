import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next.js doesn't infer it from
  // the lockfile in the home directory.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
