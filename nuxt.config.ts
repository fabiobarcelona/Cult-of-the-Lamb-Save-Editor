// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxt/image-edge", "@pinia/nuxt", "json-editor-vue/nuxt"],
  css: ["@/assets/scss/global.scss"],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      title: "Cult of the Lamb - Save file editor",
      htmlAttrs: {
        lang: "en",
      },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://cotl.xl0.org/", crossorigin: "" },
        { rel: "dns-prefetch", href: "https://cotl.xl0.org/" },
      ],
      meta: [
        {
          name: "description",
          content: "a save file editor for a game called Cult of the Lamb",
        },
        {
          property: "og:title",
          content: "Cult of the Lamb - Save file editor",
        },
        {
          property: "og:descrption",
          content: "a save file editor for a game called Cult of the Lamb",
        },
        {
          property: "og:url",
          content: "https://cult-of-the-lamb-save-editor.vercel.app/",
        },
        { name: "color-scheme", content: "dark" },
        { name: "theme-color", content: "#eeeeee" },
      ],
    },
  },
  typescript: {
    shim: false,
    strict: true,
    typeCheck: true,
  },
});
