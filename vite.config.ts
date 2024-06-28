import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/plinko',
    optimizeDeps: {
        exclude: ['typescript'],
    },
    assetsInclude: ['**/*.lottie'],
});

