<template>
  <div class="q-px-md bg-purple-custom">
    <div class="row justify-center items-center loginContainer">
      <div class="col-md-5 q-px-xl" :class="[$q.screen.lt.sm ? 'hidden': '']">
        <p class="text-h3 text- text-yellow-8 q-mb-sm">Adaalat.pk</p>
        <p class="text-subtitle2 text-white q-mb-lg">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </div>
      <q-space :class="[$q.screen.lt.sm ? 'hidden': '']"></q-space>
      <div class="col-12 col-md-6 q-py-md">
        <q-card style="width: 100%; max-width: 420px; margin: auto">
          <q-card-section>
            <p class="text-h5 text-center text-dark">Login as user</p>

            <q-form
              @submit.prevent=""
              :greedy="true"
              ref="loginForm"
              autocomplete="off"
            >
              <!-- <q-input rounded outlined dense v-model="text" label="Email" /> -->
              <FormInput
                :isInputLabelShow="false"
                v-model="loginModel.email"
                placeHolder="Enter your email"
                label="Email"
                :rules="[rules.required, rules.email]"
                :multiple="true"
                :isInput="true"
                inputType="text"
                :option="[]"
              ></FormInput>
              <FormInput
                :isInputLabelShow="false"
                v-model="loginModel.password"
                placeHolder="Enter your password"
                label="Password"
                :rules="[rules.required]"
                :multiple="true"
                :isInput="true"
                inputType="password"
                :option="[]"
              ></FormInput>
              <div class="row justify-between">
                <q-btn
                  class=""
                  type="submit"
                  rounded
                  flat
                  color="dark"
                  label="or Register now"
                  no-caps
                  :to="{path: '/signup'}"
                />
                <q-btn
                  :loading="logginIn"
                  type="submit"
                  rounded
                  color="yellow-8"
                  text-color="dark"
                  label="Login"
                  no-caps
                  :disable="googleLogging"
                  @click="loginNow"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        <p class="text-center q-mt-lg text-h6">or</p>
        <div class="row justify-center">
          <q-btn
            @click="signInWithPopup"
            :disable="googleLogging"
            color="red-6"
            rounded
            label="Google login"
            no-caps
          ></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import FormInput from "@/partials/FormInput.vue";
import { ref, onMounted } from "vue";
import rules from "@/composables/validationRules";
import axiosApiClient from "@/axios";
import { useUserStore } from "@/stores/user";
import notify from "@/composables/notify";
import type {UserCredential} from "firebase/auth"
import type { OAuthCredential } from "firebase/auth";
import "firebase/auth";
import { googleSignin } from "@/composables/popup";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

interface LoginUser {
  email: string
  password: string
}
const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();
const loginModel = ref<LoginUser>({
  email: "",
  password: "",
});
const googleLogging = ref<boolean>(false);
const logginIn = ref<boolean>(false);
const loginForm = ref<any>(null);
const loginNow = () => {
  loginForm.value.validate().then(async (success: Boolean) => {
    if (success) {
      logginIn.value = true;
      await axiosApiClient
        .post(`/user/login`, { ...loginModel.value })
        .then((res) => {
          userStore.user.data = res.data.data;
          userStore.user.token = res.data.data.token;
          notify("successfully logged in", "dark", "check_circle");
          router.push({
            path: '/'
          })
        }).catch(() => {});
      logginIn.value = false;
    }
  });
};
const signInWithPopup = async () => {
  googleLogging.value = true;
  let googleResponse: void | { result: UserCredential, credential: OAuthCredential | null } = await googleSignin();

  if (googleResponse?.result.user) {
    axiosApiClient
      .post(`user/google-login`, {
        ...googleResponse.result.user,
        idToken: googleResponse?.credential?.idToken,
        accessToken: googleResponse?.credential?.accessToken,
      })
      .then((res: any) => {
        userStore.user.data = res.data.data;
        userStore.user.token = res.data.data.token;
        googleLogging.value = false;
        notify("successfully logged in", "dark", "check_circle");
          router.push({
            path: '/'
          })
      }).catch(() => {

      });
  }
};
onMounted(() => {});
</script>
<style lang="scss" scoped>
.loginContainer {
  width: 100%;
  min-height: 100vh;
}
.bg-purple-custom {
  background: linear-gradient(90deg, #000000 0 50%, white 50% 100%);
}
</style>
