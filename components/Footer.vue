<template>
    <div>
        <footer class="footer fixed-bottom bg-light py-2">
            <p class="alignleft">
                <span class="text-muted text-center">Made with ❤ by SavagE & hayper</span>
            </p>
            <p class="aligncenter">
                <input type="submit" class="btn btn-lg btn-primary" form="form" value="Save" @click="downloadSaveFile">
            </p>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { useSaveData } from "~/stores/saveData";

const saveStore = useSaveData();

const downloadSaveFile = async (e: MouseEvent) => {
    e.preventDefault();
    if (!document) return;
    const blob = new Blob([await saveStore.exportSave()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = saveStore.fileData!.name;
    anchor.click();
    URL.revokeObjectURL(url);
};
</script>