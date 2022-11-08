<template>
    <div ref="followerModalElement" class="modal fade show" tabindex="-1" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ props.followerData.Name }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col">
                            <label>Follower ID:</label>
                            <input v-model.number="props.followerData.ID" type="number" class="form-control">
                            <span class="text-danger fw-bold" style="font-size:14px;">Changing IDs is dangerous and can
                                corrupt your save file, back up your save first.</span><br>

                            <label>Follower Level:</label>
                            <input v-model.number="props.followerData.XPLevel" type="number" class="form-control"
                                min="0"><br>

                            <label>Follower Age:</label>
                            <input v-model.number="props.followerData.Age" type="number" class="form-control"
                                min="0"><br>

                            <label>Follower Life Expectancy:</label>
                            <input v-model.number="props.followerData.LifeExpectancy" type="number" class="form-control"
                                min="0"><br>
                        </div>
                        <div class="col">
                            <label>Follower Name:</label>
                            <input v-model.number="props.followerData.Name" type="text" class="form-control"><br>
                            <div class="pt-4"></div>
                            <label>Day Joined:</label>
                            <input v-model.number="props.followerData.DayJoined" type="number" class="form-control"
                                min="0"><br>

                            <label>Days in your Cult:</label>
                            <input v-model.number="props.followerData.MemberDuration" type="number" class="form-control"
                                min="0"><br>

                            <label>Sacrificial Value:</label>
                            <input v-model.number="props.followerData.SacrificialValue" type="number"
                                class="form-control" min="0"><br>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <!-- TODO: Make this vfor -->
                        <div class="col">
                            <label>Follower Outfit:</label>
                            <select v-model.number="props.followerData.Outfit" class="form-select">
                                <option value="0">Pre Indoctrination clothes</option>
                                <option value="1">Mission Backpack</option>
                                <option value="2">Warrior Armor and Sword</option>
                                <option value="3">Indoctrinated Clothes</option>
                                <option value="7">Elderly Clothes</option>
                                <option value="8">Holiday Shirt</option>
                            </select>
                        </div>
                        <div class="col">
                            <label>Follower Skin:</label>
                            <select v-model="props.followerData.SkinName" class="form-select">
                                <option v-for="followerSkin in followerSkinList" :value="followerSkin.value">{{
                                        followerSkin.name
                                }}</option>
                            </select>
                        </div>
                        <div class="col">
                            <label>Follower Variant:</label>
                            <select v-model.number="props.followerData.SkinVariation" class="form-select">
                                <option v-if="props.followerData.SkinVariation === 1" value="1">Default</option>
                                <option v-else value="0">Default</option>
                                <option
                                    v-for="followerSkin in followerSkinList?.filter((s) => s.value === props.followerData.SkinName)[0].variant"
                                    :value="followerSkin">{{
                                            followerSkin
                                    }}</option>
                            </select>
                        </div>
                        <!-- TODO: Make this vfor -->
                        <div class="col">
                            <label>Follower Necklace: </label>
                            <select v-model.number="props.followerData.Necklace" class="form-select">
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
                            <input v-model="props.followerData.IsStarving" type="checkbox" class="form-check-input" id="stravingIndicator">
                            <label class="form-check-label" for="stravingIndicator">&nbsp;Starving Indicator</label><br>
                            <input v-model="props.followerData.MarriedToLeader" type="checkbox"
                                class="form-check-input" id="marriedToLeader">
                            <label class="form-check-label" for="marriedToLeader">&nbsp;Married to
                                Leader</label><br>
                        </div>
                        <div class="col">
                            <input v-model="props.followerData.TaxEnforcer" type="checkbox" class="form-check-input" id="taxEnforcer">
                            <label class="form-check-label" for="taxEnforcer">&nbsp;Tax Enforcer</label><br>
                            <input v-model="props.followerData.FaithEnforcer" type="checkbox" class="form-check-input" id="faithEnforcer">
                            <label class="form-check-label" for="faithEnforcer">&nbsp;Faith Enforcer</label><br>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="d-grid align-items-center justify-content-center py-3">
                                <NuxtImg loading="eager" :src='constructFollowerPreviewUrl(props.followerData)'
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
                                            <input v-model="props.followerData.Traits" type="checkbox"
                                                class="form-check-input" :value="trait.id">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <div class="center-container">
                                                <NuxtImg loading="eager" :src="trait.image"
                                                    class="image-inner small-size" alt="Image not available"
                                                    width="64" height="64" quality="100" fit="inside" />
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
                            <input v-model.number="props.followerData.Adoration" type="range" class="form-range" min="0"
                                max="100" step="1">
                            <p>{{ props.followerData.Adoration }}</p>

                            <label>Faith: </label>
                            <input v-model.number="props.followerData.Faith" type="range" class="form-range" min="0"
                                max="100" step="1">
                            <p>{{ props.followerData.Faith }}</p>

                            <label>Happiness: </label>
                            <input v-model.number="props.followerData.Happiness" type="range" class="form-range" min="0"
                                max="100" step="1">
                            <p>{{ props.followerData.Happiness }}</p>

                            <label>Illness: </label>
                            <input v-model.number="props.followerData.Illness" type="range" class="form-range" min="0"
                                max="100" step="1" />
                            <p>{{ props.followerData.Illness }}</p>

                            <label>Reeducation: </label>
                            <input v-model.number="props.followerData.Reeducation" type="range" class="form-range"
                                min="0" max="100" step="1" />
                            <p>{{ props.followerData.Reeducation }}</p>
                        </div>
                        <div class="col">
                            <label>Exhaustion: </label>
                            <input v-model.number="props.followerData.Exhaustion" type="range" class="form-range"
                                min="0" max="100" step="1" />
                            <p>{{ props.followerData.Exhaustion }}</p>

                            <label>Rest: </label>
                            <input v-model.number="props.followerData.Rest" type="range" class="form-range" min="0"
                                max="100" step="1" />
                            <p>{{ props.followerData.Rest }}</p>

                            <label>Starvation: </label>
                            <input v-model.number="props.followerData.Starvation" type="range" class="form-range"
                                min="0" max="100" step="1" />
                            <p>{{ props.followerData.Starvation }}</p>

                            <label>Satiation: </label>
                            <input v-model.number="props.followerData.Satiation" type="range" class="form-range" min="0"
                                max="100" step="1" />
                            <p>{{ props.followerData.Satiation }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { constructFollowerPreviewUrl } from '~/utils/utility';
import { Modal } from "bootstrap";

const followerModalElement = ref<HTMLElement>();
const followerModal = ref<Modal>();

const { data: followerTraitList } = useFetch<{ id: number, image: string, effect: "Positive" | "Negative", name: string, description: string }[]>("/data/followerTrait.json");
const { data: followerSkinList } = useFetch<{ name: string; value: string; variant: number[]; }[]>("/data/followerSkin.json");

onMounted(() => {
    if (!followerModalElement.value) return;

    followerModal.value = new Modal(followerModalElement.value, {
        keyboard: false
    });
});

const props = defineProps<{ followerData: any }>();

defineExpose({
    modal: followerModal
});
</script>