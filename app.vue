<style lang="scss" src="~/assets/scss/global.scss" />

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import "source-map-support/register";

useHead({
  title: "Cult of the Lamb - Save editor",
  htmlAttrs: {
    "lang": "en"
  },
  meta: [
    { name: "color-scheme", content: "dark" },
    { name: "theme-color", content: "#eeeeee" }
  ]
})
</script>