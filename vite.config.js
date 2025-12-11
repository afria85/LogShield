// vite.config.js - FIXED VERSION
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Fast Refresh for better DX
      fastRefresh: true
    })
  ],

  // Build optimizations
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Gunakan esbuild (lebih cepat) - JANGAN pakai terserOptions dengan esbuild
    minify: 'esbuild',

    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'icons': ['lucide-react']
        },
        
        // Asset naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,

    // CSS code splitting
    cssCodeSplit: true,

    // Asset optimization
    assetsInlineLimit: 4096 // 4kb
  },

  // Server config
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: true,
    cors: true
  },

  // Preview config
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
    open: true
  },

  // Resolve aliases
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@lib': '/src/lib',
      '@hooks': '/src/hooks'
    }
  },

  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react'
    ],
    exclude: ['@vite/client', '@vite/env']
  },

  // Environment variables prefix
  envPrefix: 'VITE_',

  // CSS options
  css: {
    devSourcemap: true
  },

  // Esbuild options - drop console in production
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none'
  }
});
