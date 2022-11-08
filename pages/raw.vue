<template>
    <div>
        <JsonEditorVue v-model="saveStore.saveData" />
    </div>
</template>

<script setup lang="ts">
import { useSaveData } from "~/stores/saveData";
import JsonEditorVue from "json-editor-vue";

const saveStore = useSaveData();
</script>