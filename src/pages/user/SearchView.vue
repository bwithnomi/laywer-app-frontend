<template lang="">
  <div style="height: 100vh; padding: 40px">
    <div class="row justify-center" v-if="loading">
      <q-spinner-cube color="orange" size="2.5em" />
    </div>
    <div class="row justify-center" v-if="searchResults.length == 0">
      <q-banner inline-actions rounded class="bg-yellow-8 text-white">
        Nothing found
      </q-banner>
    </div>
    <div class="row q-gutter-md" v-else>
      <div
        class="col-5 bg-white q-pa-md rounded-borders"
        v-for="(user, userIndex) in searchResults"
        :key="userIndex"
      >
        <div class="row items-center q-col-gutter-md">
          <div class="col-auto">
            <q-avatar size="60px">
              <img :src="showImage(user.profile_image)" />
            </q-avatar>
          </div>
          <div class="col-auto" style="overflow: hidden">
            <p class="text-capitalize text-bold q-mb-none">{{ user.name }}</p>
            <p class="text-grey-8 text-bold q-mb-none">{{ user.email }}</p>
          </div>
          <div class="">
            <q-btn
              label="Start Chat"
              color="yellow-8"
              unelevated
              no-caps
              icon="chat"
              size="md"
              @click="startConversation(user._id)"
            ></q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import type { UserState } from "@/stores/user";
import type { Store } from "pinia";
import { storeToRefs } from "pinia";
import axiosApiClient from "@/axios";
import type { ChatUser } from "@/interfaces";
import userPlaceholder from "@/assets/user.svg";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore: Store<"user", UserState> = useUserStore();
const { searchString } = storeToRefs(userStore);
const searchResults = ref<ChatUser[]>([]);
const loading = ref<boolean>(false)
const showImage = (image: string | null | undefined): string => {
  if (image && image != "") {
    if (image.includes("https:")) return image;
    return `${import.meta.env.VITE_BACKEND_URL}/${image}`;
  } else {
    return userPlaceholder;
  }
};

const startConversation = (receiver_id: string | number) => {
  axiosApiClient.post('user/save-conversation', {receiver_id}).then(res => {
    router.push({path: '/chat'})
  })
}

watch(searchString, () => {
  if (searchString.value != "") {
    loading.value = true;
    axiosApiClient
      .post(`/user/search`, { searchString: searchString.value })
      .then((res) => {
        searchResults.value = res.data.data;
        loading.value = false
      });
  } else {
    searchResults.value = [];
  }
});

onMounted(async () => {
  loading.value = true
  await axiosApiClient
    .post(`/user/search`, { searchString: searchString.value })
    .then((res) => {
      searchResults.value = res.data.data;
      loading.value = false
    });
});
</script>
<style lang="scss"></style>
