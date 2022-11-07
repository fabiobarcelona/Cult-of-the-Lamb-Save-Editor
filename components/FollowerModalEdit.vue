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
                            <input type="number" class="form-control" v-model="props.followerData.ID">
                            <span class="text-danger fw-bold" style="font-size:14px;">Changing IDs is dangerous and can
                                corrupt your save file, back up your save first.</span><br>

                            <label>Follower Level:</label>
                            <input type="number" class="form-control" min="0" v-model="props.followerData.XPLevel"><br>

                            <label>Follower Age:</label>
                            <input type="number" class="form-control" min="0" v-model="props.followerData.Age"><br>

                            <label>Follower Life Expectancy:</label>
                            <input type="number" class="form-control" min="0"
                                v-model="props.followerData.LifeExpectancy"><br>
                        </div>
                        <div class="col">
                            <label>Follower Name:</label>
                            <input type="text" class="form-control" v-model="props.followerData.Name"><br>

                            <label>Day Joined:</label>
                            <input type="number" class="form-control" min="0"
                                v-model="props.followerData.DayJoined"><br>

                            <label>Days in your Cult:</label>
                            <input type="number" class="form-control" min="0"
                                v-model="props.followerData.MemberDuration"><br>

                            <label>Sacrificial Value:</label>
                            <input type="number" class="form-control" min="0"
                                v-model="props.followerData.SacrificialValue"><br>
                        </div>
                    </div>

                    <hr>

                    <div class="row">
                        <!-- TODO: Make this vfor -->
                        <!-- TODO: add support for outfit -->
                        <div class="col">
                            <label>Follower Outfit:</label>
                            <select class="form-select" v-model.number="props.followerData.Outfit">
                                <option :value="0">Pre Indoctrination clothes</option>
                                <option :value="1">Mission Backpack</option>
                                <option :value="2">Warrior Armor and Sword</option>
                                <option :value="3">Indoctrinated Clothes</option>
                                <option :value="7">Elderly Clothes</option>
                                <option :value="8">Holiday Shirt</option>
                            </select>
                        </div>
                        <!-- TODO: Make this vfor -->
                        <div class="col">
                            <label>Follower Skin:</label>
                            <select class="form-select" v-model="props.followerData.SkinName">
                                <option value="Cat">Cat</option>
                                <option value="Dog">Dog</option>
                                <option value="Pig">Pig</option>
                                <option value="Deer">Deer</option>
                                <option value="Fox">Fox</option>
                                <option value="Deer_ritual">Deer Ritual</option>
                                <option value="Boss Mama Worm">Boss Mama Worm</option>
                                <option value="Rabbit">Rabbit</option>
                                <option value="Boss Mama Maggot">Boss Mama Maggot</option>
                                <option value="Boss Burrow Worm">Boss Burrow Worm</option>
                                <option value="Cow">Cow</option>
                                <option value="TwitchPoggers">POGGERS!</option>
                            </select>
                        </div>
                        <!-- TODO: Make this vfor -->
                        <div class="col">
                            <label>Follower Necklace: </label>
                            <select class="form-select" v-model.number="props.followerData.Necklace">
                                <option :value="0">None</option>
                                <option :value="45">Flower Necklace</option>
                                <option :value="46">Feather Necklace</option>
                                <option :value="47">Skull Necklace</option>
                                <option :value="48">Natures Necklace</option>
                                <option :value="49">Moon Necklace</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="d-grid align-items-center justify-content-center">
                                <NuxtImg preload loading="eager"
                                    :src='`https://cotl.xl0.org/v1/follower/${props.followerData.SkinName}${props.followerData.SkinVariation > 0 ? props.followerData.SkinVariation : ""}?colour_set=${props.followerData.SkinColour}&fps=60&format=apng${props.followerData.OldAge ? "&add_skin=Other%2FOld" : ""}${props.followerData.Necklace > 0 ? "&add_skin=Necklaces%2FNecklace_" + necklaceMap.get(props.followerData.Necklace) ?? 1 : ""}${props.followerData.DissentDuration > 0 ? "&animation=Other%2FDissenter" : "&animation=Avatars%2Fidle"}`'
                                    alt="Preview not available" quality="100" fit="inside" />
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col">
                            <input type="checkbox" class="form-check-input" v-model="props.followerData.IsStarving">
                            <label class="form-check-label">&nbsp;Starving Indicator</label><br>

                            <input type="checkbox" class="form-check-input"
                                v-model="props.followerData.MarriedToLeader">
                            <label class="form-check-label">&nbsp;Married to
                                Leader</label><br>
                        </div>
                        <div class="col">
                            <input type="checkbox" class="form-check-input" v-model="props.followerData.TaxEnforcer">
                            <label class="form-check-label">&nbsp;Tax Enforcer</label><br>

                            <input type="checkbox" class="form-check-input" v-model="props.followerData.FaithEnforcer">
                            <label class="form-check-label">&nbsp;Faith Enforcer</label><br>
                        </div>
                    </div>

                    <br>

                    <div class="row">
                        <div class="col">
                            <h4>Follower Traits</h4>
                            <hr>
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

                                    <!-- TODO: v-for -->
                                    <!-- 
                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_123" value="23">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/23.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label"
                                                for="FollowerTraits_123">Coprophiliac</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_123">Gain 10 Faith when
                                                falling ill.</label>
                                        </td>
                                    </tr>
                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_121" value="21">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/21.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_121">Gullible</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_121">15% easier to level
                                                up.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_111" value="11">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/11.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_111">Faithful</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_111">Generates Devotion
                                                15% faster.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_124" value="24">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/24.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_124">Industrious</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_124">Increased work
                                                speed by 15%.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_118" value="18">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/18.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label"
                                                for="FollowerTraits_118">Materialistic</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_118">Gain Faith when
                                                building better sleeping quarters.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_12" value="2">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/2.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_12">Naturally
                                                Obedient</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_12">On recruiting this
                                                Follower immediately gain 10 Faith.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_116" value="16">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/16.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_116">Strong
                                                Constitution</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_116">Heals 15% faster
                                                when sick and in bed rest.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_117" value="17">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/17.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_117">Zealous</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_117">Ignores dissenters
                                                when they preach.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_132" value="32">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/32.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_132">Immortal</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_132">Will never reach
                                                old age.</label>
                                        </td>
                                    </tr>



                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_120" value="20">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/20.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_120">Cynical</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_120">15% harder to level
                                                up.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_112" value="12">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/12.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_112">Faithless</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_112">Generates Devotion
                                                15% slower.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_122" value="22">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/22.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_122">Germaphobe</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_122">Lose 10 Faith when
                                                falling ill.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_11" value="1">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/1.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_11">Natural
                                                Skeptic</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_11">On recruiting
                                                Follower immediately lose 10 Faith.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_115" value="15">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/15.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_115">Sickly</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_115">Heals 15% slower
                                                when sick and in bed rest.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_125" value="25">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/25.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_125">Sloth</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_125">Work and devotion
                                                generation speed reduced by 10%.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_14" value="4">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/4.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_14">Terrified of
                                                Death</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_14">Lose -5 Faith
                                                whenever another Follower dies.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_110" value="10">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/10.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_110">Against
                                                Sacrifice</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_110">-5 Faith when a
                                                Follower is Sacrificed.</label>
                                        </td>
                                    </tr> -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <hr>

                    <div class="row">
                        <div class="col">
                            <label>Adoration (XP to next level): </label>
                            <input type="range" class="form-range" min="0" max="100" step="1"
                                v-model="props.followerData.Adoration">
                            <p>{{ props.followerData.Adoration }}</p>

                            <label>Faith: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1"
                                v-model="props.followerData.Faith">
                            <p>{{ props.followerData.Faith }}</p>

                            <label>Happiness: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1"
                                v-model="props.followerData.Happiness">
                            <p>{{ props.followerData.Happiness }}</p>

                            <label>Illness: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1"
                                v-model="props.followerData.Illness" />
                            <p>{{ props.followerData.Illness }}</p>

                            <label>Reeducation: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1"
                                v-model="props.followerData.Reeducation" />
                            <p>{{ props.followerData.Reeducation }}</p>
                        </div>
                        <div class="col">
                            <label>Exhaustion: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1"
                                v-model="props.followerData.Exhaustion" />
                            <p>{{ props.followerData.Exhaustion }}</p>

                            <label>Rest: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1"
                                v-model="props.followerData.Rest" />
                            <p>{{ props.followerData.Rest }}</p>

                            <label>Starvation: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1"
                                v-model="props.followerData.Starvation" />
                            <p>{{ props.followerData.Starvation }}</p>

                            <label>Satiation: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1"
                                v-model="props.followerData.Satiation" />
                            <p>{{ props.followerData.Satiation }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Modal } from "bootstrap";

const followerModalElement = ref<HTMLElement>();
const followerModal = ref<Modal>();

const necklaceMap = new Map([
    [45, 1],
    [46, 2],
    [47, 3],
    [48, 4],
    [49, 5]
])

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