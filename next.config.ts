import { withSentryConfig } from "@sentry/nextjs";
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ibb.co', pathname: '/**' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/**' }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' ajax.googleapis.com modelviewer.dev *.firebaseapp.com *.googleapis.com apis.google.com *.sentry.io https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;
              connect-src 'self' modelviewer.dev *.googleapis.com *.firebaseapp.com *.sentry.io *.stripe.io *.stripe.com wss://*.firebaseio.com;
              img-src 'self' blob: data: modelviewer.dev firebasestorage.googleapis.com *.unsplash.com picsum.photos i.ibb.co placehold.co *.sentry.io;
              frame-src 'self' *.stripe.com https://www.google.com/recaptcha/ *.firebaseapp.com;
              style-src 'self' 'unsafe-inline' fonts.googleapis.com;
              font-src 'self' fonts.gstatic.com data:;
              worker-src 'self' blob:;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "tca-web",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: { enabled: true },
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelCronInstrumentation: true,
});
