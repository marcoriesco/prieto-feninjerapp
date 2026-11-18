import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base './' permite hospedar o build em qualquer pasta/subdomínio
export default defineConfig({ plugins: [react(), tailwindcss()], base: './' });
