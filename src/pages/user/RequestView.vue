<template lang="">
  <div style="height: 100vh; padding: 40px">
    <p class="text-h6 text-bold">Requests</p>
    <div class="row justify-center" v-if="loading">
      <q-spinner-cube color="orange" size="2.5em" />
    </div>
    <div
      class="row justify-center"
      v-if="searchResults.length == 0 && !loading && searchString != ''"
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
              <img :src="showImage(user.sender.profile_image)" />
            </q-avatar>
          </div>
          <div class="col-auto" style="overflow: hidden">
            <p class="text-capitalize text-bold q-mb-none">{{ user.sender.name }}</p>
            <p class="text-grey-8 text-bold q-mb-none">{{ user.sender.email }}</p>
          </div>
          <div class="row q-gutter-x-md">
            <q-btn
            v-if="user.status == 'pending'"
              label="Accept"
              color="yellow-8"
              unelevated
              no-caps
              icon="check"
              size="md"
              @click="acceptRequest(user._id)"
              :disabled="disabled"
            ></q-btn>
            <q-btn
            v-if="user.status == 'pending'"
              label="Reject"
              color="red-8"
              unelevated
              no-caps
              icon="cancel"
              size="md"
              @click="rejectRequest(user._id)"
              :disabled="disabled"
            ></q-btn>
            <p  v-if="user.status != 'pending'">Request {{ user.status }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import axiosApiClient from "@/axios";
import type { ChatRequest } from "@/interfaces";
import userPlaceholder from "@/assets/user.svg";
import notify from "@/composables/notify";

const loading = ref<boolean>(false);
const disabled = ref<boolean>(false);
const searchResults = ref<ChatRequest[]>([]);
const showImage = (image: string | null | undefined): string => {
  if (image && image != "") {
    if (image.includes("https:")) return image;
    return `${import.meta.env.VITE_BACKEND_URL}/${image}`;
  } else {
    return userPlaceholder;
  }
};

const acceptRequest = (request_id: string | number) => {
  disabled.value = true;
  axiosApiClient.post("user/change-request-status", { request_id, status: "accepted" }).then(() => {
    notify("Request accepted");
    searchResults.value.forEach(e => {
      if (e._id == request_id) {
        e.status = "accepted";
      }
    })
    disabled.value = false;
  });
};

const rejectRequest = async (request_id: string | number) => {
  disabled.value = true;
  await axiosApiClient.post("user/change-request-status", { request_id, status: "rejected" }).then(() => {
    notify("Request rejected");
    searchResults.value.forEach(e => {
      if (e._id == request_id) {
        e.status = "rejected";
      }
    })
    disabled.value = false;
  });
};

onMounted(async () => {
  loading.value = true;

  await axiosApiClient.post(`/user/get-requests`).then((res) => {
    searchResults.value = res.data.data;
    loading.value = false;
  });
});
</script>
<style lang="scss"></style>
