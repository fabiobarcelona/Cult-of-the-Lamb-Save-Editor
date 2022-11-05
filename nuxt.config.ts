// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxt/image-edge", "@pinia/nuxt"],
  typescript: {
    strict: true,
    shim: true,
    typeCheck: true,
  },
});
