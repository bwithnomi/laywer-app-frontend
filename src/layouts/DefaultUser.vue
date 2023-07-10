<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-dark text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          color="yellow-8"
          class="q-mx-md"
        />

        <q-toolbar-title
          v-if="$q.screen.gt.sm"
          shrink
          class="row items-center no-wrap"
        >
          <q-avatar
            ><q-img src="@/assets/logo-png.png" width="100px"
          /></q-avatar>
          <span class="q-ml-sm text-white">Adaalat.pk</span>
        </q-toolbar-title>

        <q-space />

        <q-input
          class="GPL__toolbar-input"
          dense
          standout="bg-primary"
          v-model="searchString"
          debounce="500"
          :placeholder="`Search for ${
            userStore.user.data?.role == 'lawyer' ? 'Users' : 'Lawyers'
          }`"
          dark
        >
          <template v-slot:prepend>
            <q-icon v-if="searchString === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="searchString = ''"
            />
          </template>
        </q-input>

        <!-- <q-btn
          v-if="$q.screen.gt.xs"
          flat
          dense
          no-wrap
          color="yellow-8"
          icon="chat"
          no-caps
          label="Chat"
          class="q-ml-sm q-px-md"
        >
          <q-menu anchor="top end" self="top end">
            <q-list class="text-grey-8" style="min-width: 100px">
              <q-item aria-hidden="true">
                <q-item-section
                  class="text-uppercase text-grey-7"
                  style="font-size: 0.7rem"
                  >Create New</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-btn> -->

        <!-- <q-btn
          v-if="$q.screen.gt.xs"
          flat
          dense
          no-wrap
          color="primary"
          icon="cloud_upload"
          no-caps
          label="Upload"
          class="q-ml-sm q-px-md"
        /> -->

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <!-- <q-btn round dense flat color="white" icon="notifications">
            <q-badge color="yellow" text-color="dark" floating> 2 </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn> -->
          <q-btn
            round
            dense
            flat
            color="white"
            icon="logout"
            @click="userLogoutLocal"
          >
            <q-tooltip>Logout</q-tooltip>
          </q-btn>
          <q-btn round flat :label="`${userStore?.user?.data?.role}&nbsp;&nbsp;`"  color="yellow-8">
            <q-avatar size="26px" color="white">
              <img :src="showImage(userStore.user?.data?.profile_image)" />
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="mobile"
      @click="leftDrawerOpen = false"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="GPL__toolbar">
          <q-toolbar-title class="row items-center text-grey-8">
            <!-- <img
              class="q-pl-md"
              src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
            /> -->
            <span class="q-ml-sm">Lawyer App</span>
          </q-toolbar-title>
        </q-toolbar>

        <q-list padding>
          <q-item
            v-for="link in links1"
            :key="link.text"
            clickable
            class="GPL__drawer-item"
            :to="{ path: link.link }"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- <q-separator class="q-my-md" /> -->

          <!-- <q-item
            v-for="link in links2"
            :key="link.text"
            clickable
            class="GPL__drawer-item"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item
            v-for="link in links3"
            :key="link.text"
            clickable
            class="GPL__drawer-item"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item clickable class="GPL__drawer-item GPL__drawer-item--storage">
            <q-item-section avatar>
              <q-icon name="cloud" />
            </q-item-section>
            <q-item-section top>
              <q-item-label>Storage</q-item-label>
              <q-linear-progress :value="storage" class="q-my-sm" />
              <q-item-label caption>2.6 GB of 15 GB</q-item-label>
            </q-item-section>
          </q-item> -->
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="GPL__page-container bg-grey-4">
      <RouterView> </RouterView>

      <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
        <div class="fit q-pt-xl q-px-sm column">
          <q-btn
            round
            flat
            color="grey-8"
            stack
            no-caps
            size="26px"
            class="GPL__side-btn"
            :to="{ path: '/' }"
          >
            <q-icon size="22px" name="home" />
            <div class="GPL__side-btn__label">Home</div>
          </q-btn>

          <q-btn
            round
            flat
            color="grey-8"
            stack
            no-caps
            size="26px"
            class="GPL__side-btn"
            :to="{ path: '/profile' }"
          >
            <q-icon size="22px" name="account_circle" />
            <div class="GPL__side-btn__label">Profile</div>
          </q-btn>

          <q-btn
            round
            flat
            color="grey-8"
            stack
            no-caps
            size="26px"
            class="GPL__side-btn"
            :to="{ path: '/search' }"
          >
            <q-icon size="22px" name="search" />
            <div class="GPL__side-btn__label">Find</div>
          </q-btn>

          <q-btn
            round
            flat
            color="grey-8"
            stack
            no-caps
            size="26px"
            class="GPL__side-btn"
            :to="{ path: '/chat' }"
          >
            <q-icon size="22px" name="chat" />
            <div class="GPL__side-btn__label">Chat</div>
            <q-badge
              floating
              color="red"
              text-color="white"
              style="top: 8px; right: 16px"
            >
              1
            </q-badge>
          </q-btn>

          <q-btn
            round
            flat
            color="grey-8"
            stack
            no-caps
            size="26px"
            class="GPL__side-btn"
            :to="{ path: '/requests' }"
          >
            <q-icon size="22px" name="group" />
            <div class="GPL__side-btn__label">Requests</div>
          </q-btn>
        </div>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { userLogout } from "@/composables/popup";
import { useRouter } from "vue-router";
import { RouterView } from "vue-router";
import userPlaceholder from "@/assets/user.svg";
import type { UserState } from "@/stores/user";
import type { Store } from "pinia";
import { storeToRefs } from "pinia";

const router = useRouter();
const userStore: Store<"user", UserState> = useUserStore();
const leftDrawerOpen = ref<boolean>(false);
const { searchString } = storeToRefs(userStore);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
const userLogoutLocal = async () => {
  await userLogout();
  userStore.user = {
    data: null,
    token: null,
  };
  router.push({
    name: "login",
  });
};

let links1 = [
  { icon: "home", text: "Home", link: "/" },
  { icon: "account_circle", text: "Profile", link: "/profile" },
  { icon: "search", text: "Find", link: "/search" },
  { icon: "chat", text: "Chat", link: "/chat" },
  { icon: "group", text: "Requests", link: "/requests" },
];

const showImage = (image: string | null | undefined): string => {
  if (image && image != "") {
    if (image.includes("https:")) return image;
    return `${import.meta.env.VITE_BACKEND_URL}/${image}`;
  } else {
    return userPlaceholder;
  }
};

watch(searchString, () => {
  if (searchString.value != "") {
    router.push({ path: "/search" });
  }
});
</script>

<style lang="sass" scoped>
.GPL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 35%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368

    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px

  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500

  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>
