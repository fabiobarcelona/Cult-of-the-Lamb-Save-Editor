<template>
    <div v-if="saveStore.saveData">
        <div v-for="itemList in itemData">
            <h2>{{ itemList.name }}</h2>
            <hr />
            <div class="row row-cols-5 g-4 mb-4">
                <div v-for="item in itemList.items" class="col">
                    <div class="card">
                        <div class="text-center bg-light center-container">
                            <NuxtImg loading="eager" class="card-img-top large-size image-inner" alt="Image not available"
                                :src="item.image" width="256px" height="256px" fit="inside" />
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">{{ item.name }}</h5>
                        </div>
                        <div class="card-footer">
                            <div class="input-group">
                                <span class="input-group-text">x</span>
                                <input :value="itemQuantity(item.id)" type="number" class="form-control" min="0"
                                    @input="(e) => setItemQuantity(item.id, parseInt((e.target as HTMLInputElement)?.value) ?? 0)">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <p v-else>Load a save file!</p>
</template>

<script setup lang="ts">
import { useSaveData } from '~/stores/saveData';

type a = HTMLInputElement

const { data: itemData } = useFetch<{ name: string, items: { id: number, image: string, name: string }[] }[]>('/data/itemData.json');

const saveStore = useSaveData();

const itemQuantity = (id: number) => saveStore.saveData?.items.find((item: any) => item.type === id)?.quantity ?? 0;

const setItemQuantity = (id: number, quantity: number) => {
    if (!saveStore.saveData) return;

    saveStore.saveData.items = saveStore.saveData.items.filter((item: any) => item.quantity > 0 && ((quantity <= 0 && item.type !== id) || quantity > 0));
    if (quantity <= 0) return;

    const item = saveStore.saveData.items.find((item: any) => item.type === id);

    if (item) {
        item.quantity = quantity;
        item.UnreservedQuantity = quantity;
    } else {
        saveStore.saveData?.items.push({ type: id, quantity, QuantityReserved: 0, UnreservedQuantity: quantity });
    }
}
</script>