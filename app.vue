<style lang="scss" src="~/assets/scss/main.scss" />

<script setup lang="ts">
import { Data } from "./components/FileUploadModal.vue";
import { useSaveData } from "~/stores/saveData";
import testSave from '~/static/test_save.json';
import { type Modal } from "bootstrap";

const saveData = useSaveData();

const fileUploadModal = ref(null);
let modal: Modal | undefined;

onMounted(() => {
  if (!fileUploadModal.value) return;

  modal = (fileUploadModal.value as any).modal;
  modal?.toggle();
});

const onFileData = async (data: Data) => {
  // TODO: Error handling
  await saveData.importSave(data.data);
  saveData.setFileData({
    name: data.name,
    encrypted: data.data[0] === 69
  })

  modal?.hide();
}

const loadTestData = async () => {
  saveData.setSaveData(testSave);
  saveData.setFileData({
    name: 'test_save.json',
    encrypted: false
  });
  modal?.hide();
}
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <div class="container-fluid">
      <FileUploadModal ref="fileUploadModal" @data="onFileData" @test-data="loadTestData" />
      <div>
        <p>{{ saveData.saveData }}</p>
      </div>
    </div>
  </div>
</template>
