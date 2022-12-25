<template>
    <div v-if="saveStore.saveData">
        <JsonEditorVue v-model="saveStore.saveData" class="jse-theme-dark" />
    </div>
    <p v-else>Load a save file!</p>
</template>

<script setup lang="ts">
import { useSaveData } from "~/stores/saveData";

const saveStore = useSaveData();
</script>