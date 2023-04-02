<template>
  <div class="WAL bg-grey-4" :style="style">
    <q-layout
      view="lHh Lpr lFf"
      class="WAL__layout shadow-3"
      style="height: 90%"
      container
    >
      <q-header elevated>
        <q-toolbar class="bg-grey-3 text-black">
          <q-btn
            round
            flat
            icon="keyboard_arrow_left"
            class="WAL__drawer-open q-mr-sm"
            @click="toggleLeftDrawer"
          />

          <q-btn round flat>
            <q-avatar>
              <img
                :src="
                  !currentConversation?.sender
                    ? showImage(currentConversation?.receiver?.profile_image)
                    : showImage(currentConversation?.sender?.profile_image)
                "
              />
            </q-avatar>
          </q-btn>

          <span class="q-subtitle-1 q-pl-md">
            {{
              currentConversation?.sender
                ? currentConversation?.sender?.name
                : currentConversation?.receiver?.name
            }}
          </span>

          <q-space />

          <q-btn round flat>
            <q-icon name="attachment" class="rotate-135" />
          </q-btn>
          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 0]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section>View Profile</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Block</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        :breakpoint="690"
      >
        <q-toolbar class="bg-grey-3">
          <q-btn round flat label="Chats" />
          <q-avatar class="cursor-pointer">
            <!-- <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" /> -->
          </q-avatar>

          <q-space />

          <q-btn
            round
            flat
            icon="close"
            class="WAL__drawer-close"
            @click="toggleLeftDrawer"
          />
        </q-toolbar>

        <!-- <q-toolbar class="bg-grey-2">
          <q-input
            rounded
            outlined
            dense
            class="WAL__field full-width"
            bg-color="white"
            v-model="search"
            placeholder="Search or start a new conversation"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-toolbar> -->

        <q-scroll-area style="height: calc(100% - 100px)">
          <q-list>
            <q-item
              v-for="(conversation, index) in conversations"
              :key="conversation._id"
              clickable
              v-ripple
              @click="setCurrentConversation(index)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img
                    :src="
                      conversation.sender
                        ? showImage(conversation.sender.profile_image)
                        : showImage(conversation.receiver?.profile_image)
                    "
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">
                  {{
                    conversation.sender
                      ? conversation.sender.name
                      : conversation.receiver?.name
                  }}
                </q-item-label>
                <!-- <q-item-label class="conversation__summary" caption>
                  <q-icon name="check" v-if="conversation.sent" />
                  <q-icon name="not_interested" v-if="conversation.deleted" />
                  {{ conversation.caption }}
                </q-item-label> -->
              </q-item-section>

              <!-- <q-item-section side>
                <q-item-label caption>
                  {{ conversation.createdAt }}
                </q-item-label>
                <q-icon name="keyboard_arrow_down" />
              </q-item-section> -->
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container class="height-full q-pb-none">
        <q-infinite-scroll
          @load="onLoad"
          :disable="scrollEnable"
          reverse
          class="q-px-md q-pt-sm"
          style="min-height: 427px"
          :debounce="500"
        >
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner color="primary" name="dots" size="40px" />
            </div>
          </template>
          <div
            class="q-py-xs"
            v-for="(message, msgIndex) in messages"
            :key="msgIndex"
          >
            <div class="row no-wrap q-gutter-md items-start">
              <q-avatar size="md">
                <img
                  :src="
                    showImage(
                      messages[messages.length - (msgIndex + 1)].sender
                        ?.profile_image
                    )
                  "
                />
              </q-avatar>
              <div
                class="q-pl-sm q-py-xs q-pr-md rounded-borders"
                :class="
                  userStore.user.data?._id ==
                  messages[messages.length - (msgIndex + 1)].sender?._id
                    ? 'bg-white'
                    : 'bg-dark'
                "
              >
                <p class="q-mb-none"
                :class="
                  userStore.user.data?._id ==
                  messages[messages.length - (msgIndex + 1)].sender?._id
                    ? 'text-dark'
                    : 'text-white'
                ">
                  {{ messages[messages.length - (msgIndex + 1)].message }}
                </p>
                <p class="q-mb-none text-grey-6 text-right text-caption">
                  {{ moment(messages[messages.length - (msgIndex + 1)].createdAt).format('HH:mm A  Do MMM, YY') }}
                </p>
              </div>
            </div>
          </div>
        </q-infinite-scroll>
      </q-page-container>

      <q-footer>
        <q-toolbar class="bg-grey-3 text-black row">
          <!-- <q-btn round flat icon="insert_emoticon" class="q-mr-sm" /> -->
          <q-input
            rounded
            outlined
            dense
            class="WAL__field col-grow q-mr-sm"
            bg-color="white"
            v-model="messageToSend"
            placeholder="Type a message"
          />
          <q-btn
            @click="sendMessage"
            round
            flat
            icon="send"
            :disable="messageToSend.length == 0"
          />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import type { Store } from "pinia";
import type { Conversation, Message } from "@/interfaces";
import { useQuasar } from "quasar";
import { ref, computed, onMounted } from "vue";
import type { Ref, ComputedRef } from "vue";
import axiosApiClient from "@/axios";
import userPlaceholder from "@/assets/user.svg";
import { useUserStore } from "@/stores/user";
import type {UserState} from '@/stores/user'
import moment from "moment";

import { socket } from "@/socket";

const userStore: Store<"user", UserState> = useUserStore();
const conversations: Ref<Conversation[]> = ref([]);
const scrollEnable: Ref<boolean | undefined> = ref(true);
const $q = useQuasar();
const messages: Ref<Message[]> = ref([]);
const leftDrawerOpen: Ref<boolean | undefined> = ref(false);
const search: Ref<any> = ref("");
const messageToSend: Ref<any> = ref("");
const currentConversationIndex: Ref<number> = ref(0);

const sendMessage = async () => {
  await axiosApiClient
    .post(`/user/save-message`, {
      receiver_id: currentConversation.value?.sender
        ? currentConversation.value?.sender._id
        : currentConversation.value?.receiver?._id,
      message: messageToSend.value,
    })
    .then((res) => {
      messageToSend.value = '';
      messages.value.unshift(res.data.data);
    })
    .catch(() => {});
};

const currentConversation: ComputedRef<Conversation | null> = computed(() => {
  if (conversations.value.length > 0) {
    return conversations.value[currentConversationIndex.value];
  }
  return null;
});

const onLoad = async (index: string | number, done: any): Promise<void> => {
  axiosApiClient
    .post(`/user/get-messages`, {
      conversation_id: currentConversation.value?._id,
      pagination_id: messages.value.length
        ? messages.value[messages.value.length - 1]._id
        : null,
    })
    .then((res) => {
      console.log("load");
      messages.value = messages.value.concat(res.data.data);
      if (res.data.data.length < 3) {
        scrollEnable.value = true;
      } else {
        scrollEnable.value = false;
      }
      done();
    })
    .catch(() => {});
};

const style = computed(() => ({
  height: $q.screen.height + "px",
}));

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const setCurrentConversation = async (index: number) => {
  if (currentConversationIndex.value != index) {
    scrollEnable.value = true;
    currentConversationIndex.value = index;
    await axiosApiClient
      .post(`/user/get-messages`, {
        conversation_id: currentConversation.value?._id,
      })
      .then((res) => {
        console.log("current");

        messages.value = res.data.data;
        if (res.data.data.length < 3) {
          scrollEnable.value = true;
        } else {
          scrollEnable.value = false;
        }
      })
      .catch(() => {});
      toggleLeftDrawer();
  }
};
const showImage = (image: string | null | undefined): string => {
  if (image && image != "") {
    if(image.includes('https:')) return image;
    return `${import.meta.env.VITE_BACKEND_URL}/${image}`;
  } else {
    return userPlaceholder;
  }
};

onMounted(async () => {
  await axiosApiClient
    .post(`/user/get-conversations`)
    .then(async (res) => {
      conversations.value = res.data.data;
      await axiosApiClient
        .post(`/user/get-messages`, {
          conversation_id: conversations.value[0]?._id,
        })
        .then((res) => {
          console.log("mounted");
          messages.value = res.data.data;
          if (messages.value.length >= 3) {
            scrollEnable.value = false;
          }
        })
        .catch(() => {});
    })
    .catch(() => {});
});
socket.on(`message_${userStore.user.data?._id}`, (data) => {
  messages.value.unshift(data);
});
</script>

<style lang="sass" scoped>
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px

  &__layout
    margin: 0 auto
    height: 100%
    width: 90%
    max-width: 950px
    border-radius: 5px

  &__field.q-field--outlined .q-field__control:before
    border: none

  .q-drawer--standard
    .WAL__drawer-close
      display: none

@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0

@media (min-width: 691px)
  .WAL
    &__drawer-open
      display: none

.conversation__summary
  margin-top: 4px

.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
</style>
