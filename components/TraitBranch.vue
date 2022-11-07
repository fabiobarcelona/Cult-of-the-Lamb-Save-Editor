<template>
    <div class="tab-content my-3">
        <div class="tab-pane fade show active" id="nav-cult-traits-sustenance" role="tabpanel"
            aria-labelledby="nav-cult-traits-sustenance-tab">
            <div class="row">
                <div class="col">
                    <h3>Left Branch</h3>
                    <hr>
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="col">Unlocked?</th>
                                <th class="col">Image</th>
                                <th class="col">Name</th>
                                <th class="col">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(traitData, index) in props.leftBranch">
                                <td class="col">
                                    <input type="checkbox" class="form-check-input"
                                        :checked="selectedTrait[index] === 1"
                                        @click="() => { selectedTrait[index] = selectedTrait[index] === 1 ? null as any : 1; updateClick(); }">
                                </td>
                                <td class="col" style="background-color:black;">
                                    <NuxtImg :src="traitData.image" quality="100" alt="Trait Preview not available" preload />
                                </td>
                                <td class="col">
                                    <label class="form-check-label" :for="`CultTraits_${traitData.id}`">{{
                                            traitData.name
                                    }}</label>
                                </td>
                                <td class="col">
                                    <label class="form-check-label" :for="`CultTraits_${traitData.id}`">{{
                                            traitData.description
                                    }}</label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col">
                    <h3>Right Branch</h3>
                    <hr>
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="col">Unlocked?</th>
                                <th class="col">Image</th>
                                <th class="col">Name</th>
                                <th class="col">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(traitData, index) in props.rightBranch">
                                <td class="col">
                                    <input type="checkbox" class="form-check-input"
                                        :checked="selectedTrait[index] === 2"
                                        @click="() => { selectedTrait[index] = selectedTrait[index] === 2 ? null as any : 2; updateClick(); }">
                                </td>
                                <td class="col" style="background-color:black;">
                                    <NuxtImg :src="traitData.image" quality="100" alt="Trait Preview not available" preload />
                                </td>
                                <td class="col">
                                    <label class="form-check-label" :for="`CultTraits_${traitData.id}`">{{
                                            traitData.name
                                    }}</label>
                                </td>
                                <td class="col">
                                    <label class="form-check-label" :for="`CultTraits_${traitData.id}`">{{
                                            traitData.description
                                    }}</label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSaveData } from "~/stores/saveData";

const saveStore = useSaveData();

type TraitData = {
    id: number;
    image: string;
    name: string;
    description: string;
}

const selectedTrait = ref<number[]>([]);

const props = defineProps<{
    leftBranch: TraitData[];
    rightBranch: TraitData[];
}>();

const updateClick = () => {
    const checkTrait = (id: number, value: boolean) => {
        if (value && !saveStore.saveData.CultTraits.includes(id)) saveStore.saveData.CultTraits.push(id);
        else if (!value) saveStore.saveData.CultTraits = saveStore.saveData.CultTraits.filter(
            (traitId: number) => traitId !== id
        );
    }

    for (const [index, value] of selectedTrait.value.entries()) {
        if (props.leftBranch[index]) checkTrait(props.leftBranch[index].id, value === 1);
        if (props.rightBranch[index]) checkTrait(props.rightBranch[index].id, value === 2);
    }
}

const updateSelected = () => {
    if (saveStore.saveData) {
        const checkBranch = (traits: TraitData[], value: number) => {
            for (const [index, trait] of traits.entries()) {
                if (saveStore.saveData.CultTraits.includes(trait.id)) {
                    selectedTrait.value[index] = value;
                }
            }
        }

        selectedTrait.value = [];
        checkBranch(props.leftBranch, 1);
        checkBranch(props.rightBranch, 2);
    }
}

watch(() => props.leftBranch, updateSelected);
watch(() => props.rightBranch, updateSelected);
watch(() => saveStore.saveData, updateSelected);

onMounted(() => {
    updateSelected();
})
</script>