import { defineStore } from "pinia";

export const useSiteData = defineStore("siteData ", () => {
  const deathCatWarningAcknowledged = ref<boolean>(false);

  return {
    deathCatWarningAcknowledged,
  };
});
