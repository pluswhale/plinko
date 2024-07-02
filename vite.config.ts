import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/plinko',
    optimizeDeps: {
        exclude: ['typescript'],
    },
    server: {
        host: '0.0.0.0', // This will make the server accessible externally
        port: 3000, // Specify your desired port
    },
});

