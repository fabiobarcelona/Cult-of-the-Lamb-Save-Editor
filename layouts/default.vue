<template>
    <div class="d-flex flex-column min-vh-100">
        <div class="container-fluid">
            <FileUploadModal ref="fileUploadModal" @data="onFileData" @test-data="loadTestData" />
            <form id="form">
                <Navbar />
                <div class="tab-content my-3">
                    <div class="tab-pane fade active show" role="tabpanel" aria-labelledby="nav-buildings-tab">
                        <slot />
                    </div>
                </div>
            </form>
            <Footer />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Data } from "../components/FileUploadModal.vue";
import { useSaveData } from "~/stores/saveData";
import { type Modal } from "bootstrap";

const { data: testSave } = useFetch<any>('/data/test_save.json');

const saveStore = useSaveData();

const fileUploadModal = ref(null);
let modal: Modal | undefined;

onMounted(() => {
    if (!fileUploadModal.value) return;

    modal = (fileUploadModal.value as any).modal;
    modal?.toggle();
});

const onFileData = async (data: Data) => {
    // TODO: Error handling
    await saveStore.importSave(data.data);
    saveStore.setFileData({
        name: data.name,
        encrypted: data.data[0] === 69
    })
    modal?.hide();
}

const loadTestData = async () => {
    saveStore.setSaveData(testSave.value);
    saveStore.setFileData({
        name: 'test_save.json',
        encrypted: false
    });
    modal?.hide();
}

useHead({
    title: "Cult of the Lamb - Save Editor"
})
</script>