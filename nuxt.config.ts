// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxt/image-edge", "@pinia/nuxt"],
  vite: {
    build: {
      sourcemap: true,
    },
  },
  sourcemap: true,
  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      skipLibCheck: true,
    },
  },
});
