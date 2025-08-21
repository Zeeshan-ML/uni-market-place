import withPWAInit from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

// ✅ only enable PWA in production
const withPWA = withPWAInit({
  dest: 'public',        // where to output the service worker
  register: true,        // auto register service worker
  skipWaiting: true,     // new SW takes control immediately
  disable: process.env.NODE_ENV === 'development', // ✅ prevent multiple calls in dev
});

export default withPWA(nextConfig);
