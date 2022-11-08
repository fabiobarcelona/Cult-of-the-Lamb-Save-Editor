// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxt/image-edge", "@pinia/nuxt"],
  css: ["@/assets/scss/global.scss"],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  typescript: {
    shim: false,
    strict: true,
    typeCheck: true,
  },
});
