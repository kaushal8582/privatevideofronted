import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const APP_DESCRIPTION =
  'Upload videos, create shareable links, manage your content and reach viewers anywhere with MastPlayer.';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        injectRegister: false,
        includeManifestIcons: false,
        manifest: {
          id: '/',
          name: 'MastPlayer',
          short_name: 'MastPlayer',
          description: APP_DESCRIPTION,
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#070b14',
          theme_color: '#070b14',
          categories: ['entertainment', 'video', 'social'],
          icons: [
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          // App shell only. Videos (public/*.mp4, R2) and API responses are never cached.
          globPatterns: ['**/*.{js,css,html,woff2,ico,png,svg}'],
          globIgnores: ['**/*.mp4', '**/videos/**', '**/.well-known/**', 'icon.png'],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//, /^\/\.well-known\//, /\.[a-z0-9]+$/i],
          cleanupOutdatedCaches: true,
          clientsClaim: false,
          skipWaiting: false,
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'google-fonts-css', expiration: { maxEntries: 8 } },
            },
            {
              urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-files',
                expiration: { maxEntries: 24, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        devOptions: { enabled: false },
      }),
    ],
    server: {
      port: 5173,
    },
    build: {
      sourcemap: false,
      minify: 'esbuild',
    },
    esbuild: isProd
      ? {
          drop: ['debugger'],
          pure: ['console.log', 'console.debug', 'console.info', 'console.trace'],
          legalComments: 'none',
        }
      : undefined,
  };
});
