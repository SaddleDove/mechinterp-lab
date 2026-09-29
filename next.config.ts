import type { NextConfig } from 'next';

// Static export so the lab can be hosted anywhere (GitHub Pages, any CDN).
// BASE_PATH is set when the site is served from a sub-path, e.g. /mechinterp-lab.
const basePath = process.env.BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
