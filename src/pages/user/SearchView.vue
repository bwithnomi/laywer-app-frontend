<template lang="">
  <div style="height: 100vh; padding: 40px">
    <div class="row justify-center" v-if="loading">
      <q-spinner-cube color="orange" size="2.5em" />
    </div>
    <div
      class="row justify-center"
      v-if="searchResults.length == 0 && !loading"
    >
      <q-banner inline-actions rounded class="bg-yellow-8 text-white">
        Nothing found
      </q-banner>
    </div>
    <div
      class="row q-gutter-md"
      v-else-if="searchResults.length > 0 && !loading"
    >
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
            <p v-if="user.role == 'lawyer' && user.reviews.length > 0">
              Ratings:
              <q-rating
                v-model="user.reviews[0].avgRating"
                max="5"
                size="sm"
                color="yellow-8"
                icon="star_border"
                icon-selected="star"
                icon-half="star_half"
                readonly
              />
            </p>
            <p v-if="user.role == 'lawyer' && user.reviews.length == 0">
              Ratings:
              <q-rating
                :value="0"
                max="5"
                size="sm"
                color="yellow-8"
                icon="star_border"
                icon-selected="star"
                icon-half="star_half"
                readonly
              />
            </p>
          </div>
          <div class="">
            <q-btn
              v-if="isMyFriend(user._id)"
              label="Message"
              color="yellow-8"
              unelevated
              no-caps
              icon="chat"
              size="md"
              @click="startConversation(user._id)"
            ></q-btn>
            <q-btn
              v-else
              label="Request"
              color="dark"
              unelevated
              no-caps
              icon="add"
              size="md"
              @click="saveRequest(user._id)"
            ></q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import { useUserStore } from "@/stores/user";
import type { UserState } from "@/stores/user";
import type { Store } from "pinia";
import { storeToRefs } from "pinia";
import axiosApiClient from "@/axios";
import type { ChatUser } from "@/interfaces";
import userPlaceholder from "@/assets/user.svg";
import { useRouter } from "vue-router";
import type { Conversation } from "@/interfaces";
import notify from "@/composables/notify";

const router = useRouter();
const conversations: Ref<Conversation[]> = ref([]);
const userStore: Store<"user", UserState> = useUserStore();
const { searchString } = storeToRefs(userStore);
const searchResults = ref<ChatUser[]>([]);
const loading = ref<boolean>(false);
const showImage = (image: string | null | undefined): string => {
  if (image && image != "") {
    if (image.includes("https:")) return image;
    return `${import.meta.env.VITE_BACKEND_URL}/${image}`;
  } else {
    return userPlaceholder;
  }
};

const startConversation = (receiver_id: string | number) => {
  axiosApiClient.post("user/save-conversation", { receiver_id }).then(() => {
    router.push({ path: "/chat", query: { user: receiver_id } });
  });
};
const saveRequest = (receiver_id: string | number) => {
  axiosApiClient.post("user/save-request", { receiver_id }).then(() => {
    notify("Request sent");
  });
};

const isMyFriend = (user_id: string | number | null) => {
  let index = conversations.value.findIndex(
    (e) =>
      (e.sender && e.sender._id == user_id) ||
      (e.receiver && e.receiver._id == user_id)
  );
  if (index == -1) {
    return false;
  }
  return true;
};

watch(searchString, () => {
  if (searchString.value != "") {
    loading.value = true;
    axiosApiClient
      .post(`/user/search`, { searchString: searchString.value })
      .then((res) => {
        searchResults.value = res.data.data;
        loading.value = false;
      });
  } else {
    loading.value = true;
    axiosApiClient.post(`/user/paginated`).then((res) => {
      searchResults.value = res.data.data;
      loading.value = false;
    });
    // searchResults.value = [];
  }
});

onMounted(async () => {
  await axiosApiClient
    .post(`/user/get-conversations`)
    .then(async (res) => {
      conversations.value = res.data.data;
    })
    .catch(() => {});
  if (searchString.value != "") {
    loading.value = true;
    axiosApiClient
      .post(`/user/search`, { searchString: searchString.value })
      .then((res) => {
        searchResults.value = res.data.data;
        loading.value = false;
      });
  } else {
    loading.value = true;
    axiosApiClient.post(`/user/paginated`).then((res) => {
      searchResults.value = res.data.data;
      loading.value = false;
    });
  }
});
</script>
<style lang="scss"></style>
