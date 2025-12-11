// vite.config.js - OPTIMIZED VERSION (Fixed)
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
    minify: 'esbuild',
    
    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      },
      format: {
        comments: false
      }
    },

    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'icons': ['lucide-react'],
          
          // App chunks by feature
          'analytics': ['./src/lib/analytics.js'],
          'patterns': ['./src/lib/patterns.js'],
          'sanitizer': ['./src/lib/sanitizer.js']
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
    assetsInlineLimit: 4096, // 4kb
  },

  // Server config
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: true,
    cors: true,
    
    // Proxy for API calls in dev
    proxy: {
      '/api': {
        target: 'https://api.logshield.dev',
        changeOrigin: true,
        secure: true
      }
    }
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
      '@hooks': '/src/hooks',
      '@pages': '/src/pages'
    }
  },

  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react'
    ],
    exclude: ['@vite/client', '@vite/env']
  },

  // Environment variables prefix
  envPrefix: 'VITE_',

  // CSS options
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  },

  // Esbuild options
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
});