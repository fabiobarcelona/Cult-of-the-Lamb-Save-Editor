<template>
    <div ref="followerModalElement" class="modal fade show" tabindex="-1" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ getPropertyCaseInsensitive(props.followerData, "Name") }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col">
                            <label>Follower ID:</label>
                            <input v-model.number="id" type="number" class="form-control">
                            <span class="text-danger fw-bold" style="font-size:14px;">Changing IDs is dangerous and can
                                corrupt your save file, back up your save first.</span><br>
                            <label>Follower Level:</label>
                            <input v-model.number="xpLevel" type="number" class="form-control" min="0"><br>
                            <label>Follower Age:</label>
                            <input v-model.number="age" type="number" class="form-control" min="0"><br>
                            <label>Follower Life Expectancy:</label>
                            <input v-model.number="lifeExpectancy" type="number" class="form-control" min="0"><br>
                        </div>
                        <div class="col">
                            <label>Follower Name:</label>
                            <input v-model.number="name" type="text" class="form-control"><br>
                            <div class="pt-4"></div>
                            <label>Day Joined:</label>
                            <input v-model.number="dayJoined" type="number" class="form-control" min="0"><br>
                            <label>Days in your Cult:</label>
                            <input v-model.number="memberDuration" type="number" class="form-control" min="0"><br>
                            <label>Sacrificial Value:</label>
                            <input v-model.number="sacrificialValue" type="number" class="form-control" min="0"><br>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <!-- TODO: Make this vfor -->
                        <div class="col">
                            <label>Follower Outfit:</label>
                            <select v-model.number="outfit" class="form-select">
                                <option value="0">Pre Indoctrination clothes</option>
                                <option value="1">Mission Backpack</option>
                                <option value="3">Indoctrinated Clothes</option>
                                <option value="7">Elderly Clothes</option>
                                <option value="8">Holiday Shirt</option>
                            </select>
                        </div>
                        <div v-if="followerSkinList" class="col">
                            <label>Follower Skin:</label>
                            <select v-model.number="skinCharacter" class="form-select">
                                <option v-for="(followerSkin, index) of followerSkinList" :value="index">{{
                                        followerSkin.name
                                }}</option>
                            </select>
                        </div>
                        <div v-if="followerSkinList" class="col">
                            <label>Follower Variant:</label>
                            <select v-model.number="skinVariation" class="form-select">
                                <option
                                    v-for="(unused, index) of followerSkinList[getPropertyCaseInsensitive(props.followerData, 'SkinCharacter')].variant"
                                    :value="index">{{
                                            index === 0 ? "Default" : index
                                    }}</option>
                            </select>
                        </div>
                        <!-- TODO: Make this vfor -->
                        <div class="col">
                            <label>Follower Necklace: </label>
                            <select v-model.number="necklace" class="form-select">
                                <option value="0">None</option>
                                <option value="45">Flower Necklace</option>
                                <option value="46">Feather Necklace</option>
                                <option value="47">Skull Necklace</option>
                                <option value="48">Natures Necklace</option>
                                <option value="49">Moon Necklace</option>
                            </select>
                        </div>
                    </div>
                    <br />
                    <div class="row">
                        <label>Follower Attribute: </label>
                        <div class="col">
                            <input v-model="isStarving" type="checkbox" class="form-check-input" id="stravingIndicator">
                            <label class="form-check-label" for="stravingIndicator">&nbsp;Starving Indicator</label><br>
                            <input v-model="marriedToLeader" type="checkbox" class="form-check-input"
                                id="marriedToLeader">
                            <label class="form-check-label" for="marriedToLeader">&nbsp;Married to
                                Leader</label><br>
                        </div>
                        <div class="col">
                            <input v-model="taxEnforcer" type="checkbox" class="form-check-input" id="taxEnforcer">
                            <label class="form-check-label" for="taxEnforcer">&nbsp;Tax Enforcer</label><br>
                            <input v-model="faithEnforcer" type="checkbox" class="form-check-input" id="faithEnforcer">
                            <label class="form-check-label" for="faithEnforcer">&nbsp;Faith Enforcer</label><br>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="d-grid align-items-center justify-content-center py-3">
                                <NuxtImg loading="eager"
                                    :src='constructFollowerPreviewUrl(props.followerData, false, props.isDead)'
                                    alt="Preview not available" quality="100" fit="inside" />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <hr />
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th class="col">Unlocked?</th>
                                        <th class="col">Image</th>
                                        <th class="col">Effect</th>
                                        <th class="col">Name</th>
                                        <th class="col">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="trait in followerTraitList">
                                        <td class="col-1">
                                            <input v-model="traits" type="checkbox" class="form-check-input"
                                                :value="trait.id">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <div class="center-container">
                                                <NuxtImg loading="eager" :src="trait.image"
                                                    class="image-inner small-size" alt="Image not available" width="64"
                                                    height="64" quality="100" fit="inside" />
                                            </div>
                                        </td>
                                        <td class="col-1">
                                            <span v-if="trait.effect === 'Positive'"
                                                class="text-success">Positive</span>
                                            <span v-else class="text-danger">Negative</span>
                                        </td>
                                        <td class="col">
                                            {{ trait.name }}
                                        </td>
                                        <td class="col">
                                            {{ trait.description }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col">
                            <label>Adoration (XP to next level): </label>
                            <input v-model.number="adoration" type="range" class="form-range" min="0" max="100"
                                step="1">
                            <p>{{ adoration }}</p>
                            <label>Faith: </label>
                            <input v-model.number="faith" type="range" class="form-range" min="0" max="100" step="1">
                            <p>{{ faith }}</p>
                            <label>Happiness: </label>
                            <input v-model.number="happiness" type="range" class="form-range" min="0" max="100"
                                step="1">
                            <p>{{ happiness }}</p>
                            <label>Illness: </label>
                            <input v-model.number="illness" type="range" class="form-range" min="0" max="100"
                                step="1" />
                            <p>{{ illness }}</p>
                            <label>Reeducation: </label>
                            <input v-model.number="reeducation" type="range" class="form-range" min="0" max="100"
                                step="1" />
                            <p>{{ reeducation }}</p>
                        </div>
                        <div class="col">
                            <label>Exhaustion: </label>
                            <input v-model.number="exhaustion" type="range" class="form-range" min="0" max="100"
                                step="1" />
                            <p>{{ exhaustion }}</p>
                            <label>Rest: </label>
                            <input v-model.number="rest" type="range" class="form-range" min="0" max="100" step="1" />
                            <p>{{ rest }}</p>
                            <label>Starvation: </label>
                            <input v-model.number="starvation" type="range" class="form-range" min="0" max="75"
                                step="1" />
                            <p>{{ starvation }}</p>
                            <label>Satiation: </label>
                            <input v-model.number="satiation" type="range" class="form-range" min="0" max="100"
                                step="1" />
                            <p>{{ satiation }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { constructFollowerPreviewUrl, getPropertyCaseInsensitive, setPropertyCaseInsensitive, generateObjectInsensitiveComputed } from '~/utils/utility';
import { Modal } from "bootstrap";

const followerModalElement = ref<HTMLElement>();
const followerModal = ref<Modal>();

const { data: followerTraitList } = useFetch<{ id: number, image: string, effect: "Positive" | "Negative", name: string, description: string }[]>("/data/followerTrait.json");
const { data: followerSkinList } = useFetch<{ name: string; variant: string[]; }[]>("/data/followerSkin.json");

onMounted(() => {
    if (!followerModalElement.value) return;

    followerModal.value = new Modal(followerModalElement.value, {
        keyboard: false
    });
});

const updateSkin = () => {
    if (!followerSkinList.value) return;
    let skinName = followerSkinList.value[getPropertyCaseInsensitive(props.followerData, "SkinCharacter")].variant[getPropertyCaseInsensitive(props.followerData, "SkinVariation")];
    if (!skinName) {
        props.followerData.SkinVariation = 0;
        skinName = followerSkinList.value[getPropertyCaseInsensitive(props.followerData, "SkinCharacter")].variant[getPropertyCaseInsensitive(props.followerData, "SkinVariation")];
    };
    setPropertyCaseInsensitive(props.followerData, "SkinName", skinName);
}

watch(() => getPropertyCaseInsensitive(props.followerData, "SkinCharacter"), updateSkin);
watch(() => getPropertyCaseInsensitive(props.followerData, "SkinVariation"), updateSkin);

const props = defineProps<{ followerData: any, isDead?: boolean }>();

const id = generateObjectInsensitiveComputed(() => props.followerData, "ID");
const xpLevel = generateObjectInsensitiveComputed(() => props.followerData, "XPLevel");
const age = generateObjectInsensitiveComputed(() => props.followerData, "Age");
const lifeExpectancy = generateObjectInsensitiveComputed(() => props.followerData, "LifeExpectancy");
const name = generateObjectInsensitiveComputed(() => props.followerData, "Name");
const dayJoined = generateObjectInsensitiveComputed(() => props.followerData, "DayJoined");
const memberDuration = generateObjectInsensitiveComputed(() => props.followerData, "MemberDuration");
const sacrificialValue = generateObjectInsensitiveComputed(() => props.followerData, "SacrificialValue");

const outfit = generateObjectInsensitiveComputed(() => props.followerData, "Outfit");
const skinCharacter = generateObjectInsensitiveComputed(() => props.followerData, "SkinCharacter");
const skinVariation = generateObjectInsensitiveComputed(() => props.followerData, "SkinVariation");
const necklace = generateObjectInsensitiveComputed(() => props.followerData, "Necklace");

const isStarving = generateObjectInsensitiveComputed(() => props.followerData, "IsStarving");
const marriedToLeader = generateObjectInsensitiveComputed(() => props.followerData, "MarriedToLeader");
const taxEnforcer = generateObjectInsensitiveComputed(() => props.followerData, "TaxEnforcer");
const faithEnforcer = generateObjectInsensitiveComputed(() => props.followerData, "FaithEnforcer");

const traits = generateObjectInsensitiveComputed(() => props.followerData, "Traits");

const adoration = generateObjectInsensitiveComputed(() => props.followerData, "Adoration");
const faith = generateObjectInsensitiveComputed(() => props.followerData, "Faith");
const happiness = generateObjectInsensitiveComputed(() => props.followerData, "Happiness");
const illness = generateObjectInsensitiveComputed(() => props.followerData, "Illness");
const reeducation = generateObjectInsensitiveComputed(() => props.followerData, "Reeducation");
const exhaustion = generateObjectInsensitiveComputed(() => props.followerData, "Exhaustion");
const rest = generateObjectInsensitiveComputed(() => props.followerData, "Rest");
const starvation = generateObjectInsensitiveComputed(() => props.followerData, "Starvation");
const satiation = generateObjectInsensitiveComputed(() => props.followerData, "Satiation");

defineExpose({
    modal: followerModal
});
</script>