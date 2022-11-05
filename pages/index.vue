<template>
    <div>
        <div v-if="saveStore.saveData">
            <h2>Cult Information &amp; Character Stats</h2>
            <hr />
            <div class="row mb-2">
                <div class="col">
                    <label for="CultName">Cult Name:</label>
                    <input type="text" class="form-control" id="CultName" v-model="saveStore.saveData.CultName" />
                    <br />
                    <label for="CurrentDayIndex">Current Day:</label>
                    <input type="number" class="form-control" id="CurrentDayIndex"
                        v-model="saveStore.saveData.CurrentDayIndex" />
                    <br />
                    <h4>Dungeon Doors Unlocked</h4>
                    <div class="row mb-4">
                        <div class="col" v-for="(dungeon, index) in dungeonMap" :key="`dungeon_col_${index}`">
                            <div v-for="dungeonData of dungeon" :key="`dungeon_col_${index}_${dungeonData.id}`">
                                <input type="checkbox" class="form-check-input" :id="`dungeon_${dungeonData.id}`"
                                    :checked="saveStore.saveData.UnlockedDungeonDoor.includes(dungeonData.id)"
                                    @click="(event) => setDungeonUnlockState(dungeonData.id, (event.target as HTMLInputElement).checked)">
                                <label class="form-check-label" :for="`dungeon_${dungeonData.id}`">&nbsp;{{
                                        dungeonData.name
                                }}</label>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-danger" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        Spoiler section
                    </button>
                    <p />
                    <div class="collapse" id="collapseExample">
                        <div class="card card-body">
                            <div class="row">
                                <div class="col">
                                    <input type="checkbox" class="form-check-input" id="DeathCatBeaten"
                                        v-model="saveStore.saveData.DeathCatBeaten" @click="deathCatClick">
                                    <label for="DeathCatBeaten">&nbsp;The One Who Waits Beaten</label>
                                </div>
                                <div class="col">
                                    <input type="checkbox" class="form-check-input" id="RatauKilled"
                                        v-model="saveStore.saveData.RatauKilled">
                                    <label for="RatauKilled">&nbsp;Ratau Killed</label>
                                </div>
                            </div>

                            <DeathCatBeatenWarningModal ref="deathCatBeatenWarningModal" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label for="PLAYER_HEALTH">Red Hearts: <span class="text-muted" style="font-size:12px;">1 unit =
                            half a
                            heart (i.e 10 = 5 hearts)</span></label>
                    <input type="number" class="form-control" id="PLAYER_HEALTH"
                        v-model="saveStore.saveData.PLAYER_HEALTH"><br>
                    <label for="PLAYER_SPIRIT_HEARTS">Spirit Hearts:</label>
                    <input type="number" class="form-control" id="PLAYER_SPIRIT_HEARTS"
                        v-model="saveStore.saveData.PLAYER_SPIRIT_HEARTS"><br>
                    <label for="PLAYER_BLACK_HEARTS">Diseased Hearts:</label>
                    <input type="number" class="form-control" id="PLAYER_BLACK_HEARTS"
                        v-model="saveStore.saveData.PLAYER_BLACK_HEARTS"><br>
                    <label for="PLAYER_BLUE_HEARTS">Blue Hearts:</label>
                    <input type="number" class="form-control" id="PLAYER_BLUE_HEARTS"
                        v-model="saveStore.saveData.PLAYER_BLUE_HEARTS"><br>
                </div>
            </div>
            <h2>Cult Traits</h2>
            <hr />
            <nav>
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    <button v-for="(data, index) of TraitData"
                        :class="[SelectedTraitTab === index ? 'active' : '', 'nav-link']" data-bs-toggle="tab"
                        type="button" tabindex="-1" role="tab" :aria-selected="SelectedTraitTab === index"
                        @click="() => SelectedTraitTab = index">
                        {{ data.name }}
                    </button>
                </div>
            </nav>
            <TraitBranch :left-branch="TraitData[SelectedTraitTab].leftBranch"
                :right-branch="TraitData[SelectedTraitTab].rightBranch" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSaveData } from "~/stores/saveData";
import { useSiteData } from "~/stores/siteData";

const deathCatBeatenWarningModal = ref(null);

const siteData = useSiteData();

const deathCatClick = () => {
    if (siteData.deathCatWarningAcknowledged || !deathCatBeatenWarningModal.value) return;
    (deathCatBeatenWarningModal.value as any).modal?.toggle();
    siteData.deathCatWarningAcknowledged = true;
}

const SelectedTraitTab = ref<number>(0);

const TraitData = [
    {
        name: "Afterlife",
        leftBranch: [{
            id: 9,
            image: "/Traits/9.png",
            name: "Belief in Sacrifice",
            description: "Gain 20 Faith whenever a follower is sacrificed."
        },
        {
            id: 30,
            image: "/Traits/30.png",
            name: "Respect Your Elders",
            description: "Gain 10 Faith when a Follower becomes an elder."
        }
        ],
        rightBranch: [{
            id: 3,
            image: "/Traits/3.png",
            name: "Belief in Afterlife",
            description: "Death is not the end. When a Follower dies only lose -5 faith instead of -20."
        },
        {
            id: 31,
            image: "/Traits/31.png",
            name: "Good Die Young",
            description: "Gain 10 Faith if an elder is sacrificed, murdered or consumed, but lose 20 Faith if an elder dies naturally."
        }
        ]
    },
    {
        name: "Work and Worship",
        leftBranch: [{
            id: 11,
            image: "/Traits/11.png",
            name: "Faithful",
            description: "Generates Devotion 15% faster."
        }],
        rightBranch: [{
            id: 24,
            image: "/Traits/24.png",
            name: "Industrious",
            description: "Increased work speed by 15%."
        }]
    },
    {
        name: "Possessions",
        leftBranch: [{
            id: 18,
            image: "/Traits/18.png",
            name: "Materialistic",
            description: "Gain Faith when building better sleeping quarters."
        },
        {
            id: 27,
            image: "/Traits/27.png",
            name: "Sacral Architecture",
            description: "Gain 5 Faith when a building is constructed."
        }],
        rightBranch: [{
            id: 19,
            image: "/Traits/19.png",
            name: "False Idols",
            description: "Gain 7 Faith when a decoration is built."
        },
        {
            id: 26,
            image: "/Traits/26.png",
            name: "Devotee",
            description: "Gain more Faith when you give a sermon."
        }]
    },
    {
        name: "Law and Order",
        leftBranch: [{
            id: 7,
            image: "/Traits/7.png",
            name: "Belief in Original Sin",
            description: "All are born guilty. Reduced Faith loss when putting a Follower in jail who is not dissenting."
        }],
        rightBranch: [{
            id: 8,
            image: "/Traits/8.png",
            name: "Absolution",
            description: "Freedom above all else. Every day that begins without anyone in prison, gain +10 Faith."
        }]
    },
    {
        name: "Sustenance",
        leftBranch: [{
            id: 5,
            image: "/Traits/5.png",
            name: "Cannibal",
            description: "Gain +5 Faith when a Follower eats a meal made from Follower meat."
        },
        {
            id: 28,
            image: "/Traits/28.png",
            name: "Substances Encouraged",
            description: "Gain 20 Faith when Brainwashing Ritual is performed."
        }
        ],
        rightBranch: [{
            id: 6,
            image: "/Traits/6.png",
            name: "Grass Eater",
            description: "No longer lose Faith when a follower eats a Grass Meal."
        },
        {
            id: 29,
            image: "/Traits/29.png",
            name: "Prohibitionist",
            description: "Work speed and devotion generation increased by 10%, but 50% chance of Followers becoming sick after the Brainwashing ritual."
        }]
    }
]

const saveStore = useSaveData();

const setDungeonUnlockState = (id: number, state: boolean) => {
    if (!saveStore.saveData) return;

    if (state) {
        if (saveStore.saveData.UnlockedDungeonDoor.includes(id)) return;
        saveStore.saveData.UnlockedDungeonDoor.push(id);
    } else {
        saveStore.saveData.UnlockedDungeonDoor = saveStore.saveData.UnlockedDungeonDoor.filter(
            (dungeonId: number) => dungeonId !== id
        );
    }
}

const dungeonMap = [
    [
        {
            name: "Darkwood",
            id: 7,
        },
        {
            name: "Anura",
            id: 8,
        },
    ],
    [
        {
            name: "Anchordeep",
            id: 9,
        },
        {
            name: "Silk Cradle",
            id: 10,
        },
    ],
]
</script>