<template>
    <div>
        <h2>Tarot Cards</h2>
        <hr>
        <table class="table">
            <thead>
                <tr>
                    <th class="col">Unlocked?</th>
                    <th class="col">Image</th>
                    <th class="col">Name</th>
                    <th class="col">Effect</th>
                    <th class="col">Effect +</th>
                    <th class="col">Effect ++</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="tarotCard in tarotCardList">
                    <td class="col">
                        <input v-model="saveStore.saveData.PlayerFoundTrinkets" type="checkbox" class="form-check-input"
                            :value="tarotCard.id">
                    </td>
                    <td class="col">
                        <NuxtImg preload loading="eager" :src="tarotCard.image" quality="100" fit="inside" />
                    </td>
                    <td class="col">
                        <label class="form-check-label">{{ tarotCard.name }}</label>
                    </td>
                    <td class="col">
                        <label class="form-check-label">{{ tarotCard.effect }}</label>
                    </td>
                    <td class="col">
                        <label class="form-check-label">{{ tarotCard.effect_1 }}</label>
                    </td>
                    <td class="col">
                        <label class="form-check-label">{{ tarotCard.effect_2 }}</label>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { useSaveData } from "~/stores/saveData";

const { data: tarotCardList } = useFetch<{ id: number, image: string, name: string, effect: string, effect_1: string, effect_2: string }[]>("/data/tarotCard.json");

const saveStore = useSaveData();
</script>