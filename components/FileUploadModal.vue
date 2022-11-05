<script setup lang="ts">
import { Modal } from "bootstrap";

export type Data = {
    name: string;
    data: Uint8Array
}

const fileUploadModal = ref<HTMLDivElement>();
const fileInputForm = ref<HTMLInputElement>();

const emit = defineEmits<{
    (e: 'data', data: Data): void
    (e: 'testData'): void
}>();

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};

let uploadModal = ref<Modal>();

onMounted(() => {
    if (!fileUploadModal.value || !fileInputForm.value) return;

    uploadModal.value = new Modal(fileUploadModal.value, {
        keyboard: false,
        backdrop: "static",
    });

    fileUploadModal.value.onchange = (ev: Event) => {
        const file = (ev.target as any).files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer((ev.target as any).files[0]);

        reader.onloadend = () => {
            const data = new Uint8Array(reader.result as ArrayBuffer);
            emit('data', { name: file.name, data });
        };
    };
});

defineExpose({
    modal: uploadModal
})
</script>

<template>
    <div class="modal fade" ref="fileUploadModal" tabindex="-1" aria-labelledby="fileUploadModalLabel">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Upload your save file</h5>
                    <img src="~/assets/lamb.gif" alt="lamb" width="64" height="64">
                </div>
                <div class="modal-body">
                    <h1 class="text-center">Cult of the Lamb - Save File Editor</h1>
                    <p class="mb-4 text-muted text-center">
                        Upload your save file below and start editing your save
                        file to your
                        liking.
                        <span class="text-danger">Make sure you always backup your original save file.</span>
                        After you are done, replace your old save file with the new one.
                    </p>

                    <form>
                        <input type='file' class="form-control mb-5" ref="fileInputForm" />
                    </form>

                    <hr />

                    <p class="mb-4 text-muted text-center">
                        If you don't know where your save file is located, copy the below path and paste in your
                        file explorer top bar or, if you are on Windows, hit Windows key + R and paste the path in
                        the Run dialog box.
                    </p>
                    <label>Save file location Windows:</label>
                    <div class="input-group mb-5">
                        <input type="text" class="form-control"
                            value="%USERPROFILE%\AppData\LocalLow\Massive Monster\Cult Of The Lamb\saves"
                            aria-label="Windows Save File Location" disabled>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary"
                                @click="(event) => copyToClipboard(((event.target! as HTMLButtonElement).parentElement!.parentElement!.querySelector('input.form-control') as HTMLInputElement).value)"
                                type="button">Copy</button>
                        </div>
                    </div>


                    <label>Save file location macOS:</label>
                    <div class="input-group mb-5">
                        <input type="text" class="form-control"
                            value="~/Library/Application Support/Massive Monster/Cult Of The Lamb/saves"
                            aria-label="macOS Save File Location" disabled>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary"
                                @click="(event) => copyToClipboard(((event.target! as HTMLButtonElement).parentElement!.parentElement!.querySelector('input.form-control') as HTMLInputElement).value)"
                                type="button">Copy</button>
                        </div>
                    </div>

                    <hr />

                    <div class="text-center">
                        <p class="mb-4 text-muted text-center">
                            If you don't have a save file, or want to try out the application first before editing
                            your
                            real save file,
                            click the button below to load a test save file.
                        </p>
                        <button class="btn btn-outline-secondary" @click="$emit('testData')" type="button">Load test
                            data</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>