import path from "node:path";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/pwa"],  
  vite: {
    build: {
      sourcemap: true,
    },
  },
  typescript: {
    strict: true,
    tsConfig: {
      skipLibCheck: true,
    }
  },
  sourcemap: true,
  ssr: false,
});
