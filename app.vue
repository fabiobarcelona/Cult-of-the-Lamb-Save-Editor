<style lang="scss" src="~/assets/scss/main.scss" />

<script setup lang="ts">
import { Data } from "./components/FileUploadModal.vue";
import { type Modal } from "bootstrap";

const fileUploadModal = ref(null);
let modal: Modal | undefined;

onMounted(() => {
  if (!fileUploadModal.value) return;

  modal = (fileUploadModal.value as any).modal;
  modal?.toggle();
});

const onFileData = (data: Data) => {
  modal?.hide();
}

const loadTestData = () => {
  modal?.hide();
}
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <div class="container-fluid">
      <FileUploadModal ref="fileUploadModal" @data="onFileData" @test-data="loadTestData" />
    </div>
  </div>
</template>
