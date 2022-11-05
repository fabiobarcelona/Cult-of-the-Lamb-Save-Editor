<template>
    <div v-if="saveData.saveData">
        <h2>Cult Information &amp; Character Stats</h2>
        <hr />
        <div class="row mb-2">
            <div class="col">
                <label for="CultName">Cult Name:</label>
                <input type="text" class="form-control" id="CultName" v-model="saveData.saveData.CultName" />
                <br />
                <label for="CurrentDayIndex">Current Day:</label>
                <input type="number" class="form-control" id="CurrentDayIndex"
                    v-model="saveData.saveData.CurrentDayIndex" />
                <br />
                <h4>Dungeon Doors Unlocked</h4>
                <div class="row mb-4">
                    <div class="col" v-for="(dungeon, index) in dungeonMap" :key="`dungeon_col_${index}`">
                        <div v-for="dungeonData of dungeon" :key="`dungeon_col_${index}_${dungeonData.id}`">
                            <input type="checkbox" class="form-check-input" :id="`dungeon_${dungeonData.id}`"
                                :checked="saveData.saveData.UnlockedDungeonDoor.includes(dungeonData.id)"
                                @click="(event) => setDungeonUnlockState(dungeonData.id, (event.target as HTMLInputElement).checked)">
                            <label class="form-check-label" :for="`dungeon_${dungeonData.id}`">&nbsp;{{ dungeonData.name
                            }}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <label for="PLAYER_HEALTH">Red Hearts: <span class="text-muted" style="font-size:12px;">1 unit = half a
                        heart (i.e 10 = 5 hearts)</span></label>
                <input type="number" class="form-control" id="PLAYER_HEALTH"
                    v-model="saveData.saveData.PLAYER_HEALTH"><br>
                <label for="PLAYER_SPIRIT_HEARTS">Spirit Hearts:</label>
                <input type="number" class="form-control" id="PLAYER_SPIRIT_HEARTS"
                    v-model="saveData.saveData.PLAYER_SPIRIT_HEARTS"><br>
                <label for="PLAYER_BLACK_HEARTS">Diseased Hearts:</label>
                <input type="number" class="form-control" id="PLAYER_BLACK_HEARTS"
                    v-model="saveData.saveData.PLAYER_BLACK_HEARTS"><br>
                <label for="PLAYER_BLUE_HEARTS">Blue Hearts:</label>
                <input type="number" class="form-control" id="PLAYER_BLUE_HEARTS"
                    v-model="saveData.saveData.PLAYER_BLUE_HEARTS"><br>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSaveData } from "~/stores/saveData";

const saveData = useSaveData();

const setDungeonUnlockState = (id: number, state: boolean) => {
    if (!saveData.saveData) return;

    if (state) {
        if (saveData.saveData.UnlockedDungeonDoor.includes(id)) return;
        saveData.saveData.UnlockedDungeonDoor.push(id);
    } else {
        saveData.saveData.UnlockedDungeonDoor = saveData.saveData.UnlockedDungeonDoor.filter(
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