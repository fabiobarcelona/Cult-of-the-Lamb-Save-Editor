import { defineStore } from "pinia";

export const useSiteData = defineStore("siteData ", () => {
  const deathCatWarningAcknowledged = useState<boolean>(() => false);

  return {
    deathCatWarningAcknowledged,
  };
});
