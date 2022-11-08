<template>
    <div v-if="saveStore.saveData">
        <div v-for="itemList in itemData">
            <h2>{{ itemList.name }}</h2>
            <hr />
            <div class="row row-cols-8 g-4 mb-4">
                <div v-for="item in itemList.items" class="col">
                    <div class="card">
                        <div class="text-center bg-light">
                            <NuxtImg loading="eager" class="card-img-top my-2 w-auto" :alt="item.name"
                                :src="item.image" width="116px" height="82px" fit="inside" />
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">{{ item.name }}</h5>
                        </div>
                        <div class="card-footer">
                            <div class="input-group">
                                <span class="input-group-text">x</span>
                                <input
                                    v-model="saveStore.saveData.items.filter((d: any) => d.type === item.id)[0].quantity"
                                    type="number" class="form-control">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSaveData } from '~/stores/saveData';

const { data: itemData } = useFetch<{ name: string, items: { id: number, image: string, name: string }[] }[]>('/data/itemData.json');

const saveStore = useSaveData();
</script>