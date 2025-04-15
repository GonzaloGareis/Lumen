import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Allow cross-origin requests
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true', // Ensure credentials (cookies) are included
          },
        ],
      },
    ];
  },
  // Ensure cookies are handled properly for cross-origin requests (for development environments)
  env: {
    NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
    NEXT_PUBLIC_CLERK_API_KEY: process.env.NEXT_PUBLIC_CLERK_API_KEY,
    CLERK_API_URL: process.env.CLERK_API_URL,
    CLERK_FRONTEND_API_URL: process.env.CLERK_FRONTEND_API_URL,
  },
};

export default nextConfig;
