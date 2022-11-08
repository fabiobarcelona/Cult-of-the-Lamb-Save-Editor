<template>
    <div v-if="saveStore.saveData">
        <div v-if="saveStore.saveData.Followers.length > 0">
        <FollowerModalEdit v-if="selectedFollower" ref="followerModalEdit" :follower-data="selectedFollower" />
        <div class="row row-cols-8 g-4 mb-4 gap-3">
            <div v-for="follower in saveStore.saveData.Followers" class="card" style="width: 16rem;">
                <NuxtImg loading="eager" :src='constructFollowerPreviewUrl(follower, true)' class="card-img-top"
                    alt="Picture not available" quality="100" width="120px" height="224px" fit="inside" />
                <div class="card-body">
                    <h5 class="card-title">
                        {{ follower.Name }}
                    </h5>
                    <p class="card-text">
                        Level: <b>{{ follower.XPLevel }}</b>
                    </p>
                    <div class="row">
                        <div class="col">
                            <button type="button" class="btn btn-danger" @click="() => deleteFollower(follower.ID)">
                                Delete
                            </button>
                        </div>
                        <div class="col text-end">
                            <button type="button" class="btn btn-primary" @click="() => editFollower(follower)">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <p v-else>You have no follower! Go get some!</p>
    </div>
</template>

<script setup lang="ts">
import { constructFollowerPreviewUrl } from '~/utils/utility';
import { useSaveData } from '~/stores/saveData';

const selectedFollower = ref<any>();
const followerModalEdit = ref<HTMLElement & { modal: any | undefined }>();

const editFollower = async (followerData: number) => {
    selectedFollower.value = followerData;

    await new Promise<void>(async (resolve) => {
        while (!followerModalEdit.value) {
            await new Promise<void>((r) => setTimeout(r, 1));
        }
        resolve();
    });

    followerModalEdit.value?.modal?.toggle();
}

const deleteFollower = (id: number) => {
    if (!saveStore.saveData) return;
    saveStore.saveData.Followers = saveStore.saveData.Followers.filter((follower: any) => follower.ID !== id);
}

const saveStore = useSaveData();
</script>