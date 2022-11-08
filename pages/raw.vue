<template>
    <div v-if="saveStore.saveData">
        <JsonEditorVue v-model="saveStore.saveData" />
    </div>
    <p v-else>Load a save file!</p>
</template>

<script setup lang="ts">
import { useSaveData } from "~/stores/saveData";
import JsonEditorVue from "json-editor-vue";

const saveStore = useSaveData();
</script>