<template>
  <div class="q-px-md bg-purple-custom">
    <div class="row justify-center items-center loginContainer">
      <div class="col-md-5 q-px-xl" :class="[$q.screen.lt.sm ? 'hidden' : '']">
        <p class="text-h3 text-dark q-mb-sm">Adaalat.pk</p>
        <p class="text-subtitle2 text-grey-9 q-mb-lg">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </div>
      <q-space :class="[$q.screen.lt.sm ? 'hidden' : '']"></q-space>
      <div class="col-12 col-md-6 q-py-md">
        <q-card style="width: 100%; max-width: 420px; margin: auto">
          <q-card-section>
            <p class="text-h5 text-center text-dark">Register Here</p>
            <div class="q-gutter-sm row justify-center">
              <q-radio
                v-model="loginModel.role"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="user"
                label="User"
              />
              <q-radio
                v-model="loginModel.role"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="lawyer"
                label="Lawyer"
              />
            </div>
            <q-form
              @submit.prevent=""
              :greedy="true"
              ref="loginForm"
              autocomplete="off"
            >
              <FormInput
                class="q-mb-sm"
                :isInputLabelShow="false"
                v-model="loginModel.name"
                placeHolder="Enter your full name"
                label="Full Name"
                :rules="[rules.required]"
                :multiple="true"
                :isInput="true"
                inputType="text"
                :option="[]"
              ></FormInput>
              <FormInput
                class="q-mb-sm"
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
              <q-file
                outlined
                dense
                rounded
                class="q-mb-sm"
                :isInputLabelShow="false"
                v-model="loginModel.profile_image"
                label="Profile image"
                :rules="[rules.required]"
              ></q-file>
              <FormInput
                class="q-mb-sm"
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
              <q-file
                v-if="loginModel.role != 'user'"
                outlined
                dense
                rounded
                class="q-mb-sm"
                :isInputLabelShow="false"
                v-model="loginModel.license"
                label="License image"
                :rules="[rules.required]"
              ></q-file>
              <FormInput
                v-if="loginModel.role != 'user'"
                class="q-mb-sm"
                :isInputLabelShow="false"
                v-model="loginModel.court_type"
                placeHolder="Select your court type"
                label="Court type"
                :rules="[rules.required]"
                :isInput="false"
                compType="select"
                optionlabel="value"
                optionvalue="id"
                :option="courtTypes"
              ></FormInput>
              <FormInput
                v-if="loginModel.role != 'user'"
                class="q-mb-sm"
                :isInputLabelShow="false"
                v-model="loginModel.lawyer_type"
                placeHolder="Select your category"
                label="Lawyer type"
                :rules="[rules.required]"
                :isInput="false"
                compType="select"
                optionlabel="value"
                optionvalue="id"
                :option="lawyerTypes"
              ></FormInput>
              <div class="row justify-between">
                <q-btn
                  class=""
                  type="submit"
                  rounded
                  flat
                  color="dark"
                  label="or Login"
                  no-caps
                  :to="{ path: '/login' }"
                />
                <q-btn
                  :loading="logginIn"
                  type="submit"
                  rounded
                  color="dark"
                  text-color="white"
                  label="Sign Up"
                  no-caps
                  @click="registerNow"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
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
import "firebase/auth";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import useFormData from "@/composables/formdate";

interface SignupUser {
  email: string;
  name: string;
  password: string;
  profile_image: any;
  role: string;
  court_type: string;
  lawyer_type: string;
  license: any;
}
const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();
const loginModel = ref<SignupUser>({
  name: "",
  email: "",
  password: "",
  profile_image: "",
  role: "user",
  court_type: "",
  lawyer_type: "",
  license: "",
});
const courtTypes = [
  {
    id: "supreme_court",
    value: "Supreme Court",
  },
  {
    id: "high_court",
    value: "High Court",
  },
  {
    id: "session_court",
    value: "Session Court",
  },
  {
    id: "supreme_court",
    value: "Supreme Court",
  },
  {
    id: "family_court",
    value: "Family court",
  },
  {
    id: "juvenile_court",
    value: "Juvenile Court",
  },
];
const lawyerTypes = [
  {
    id: "environmental_lawyer",
    value: "Environmental Lawyer",
  },
  {
    id: "business_lawyer",
    value: "Business Lawyer",
  },
  {
    id: "criminal_lawyer",
    value: "Criminal Lawyers",
  },
  {
    id: "family_lawyer",
    value: "Family Lawyer",
  },
  {
    id: "immigration_lawyer",
    value: "Immigration Lawyer",
  },
  {
    id: "tax_lawyer",
    value: "Tax Lawyer",
  },
  {
    id: "personal_lawyer",
    value: "Personal Injury Lawyer",
  },
  {
    id: "civil_lawyer",
    value: "Civil Litigation Lawyer",
  },
  {
    id: "employment_lawyer",
    value: "Employment or Labor Lawyer",
  },
  {
    id: "intellectual_property_lawyer",
    value: "Intellectual Property Lawyer",
  },
  {
    id: "estate_panning_lawyer",
    value: "Estate Planning Lawyer",
  },
  {
    id: "digital_media_lawyer",
    value: "Digital Media / Internet Lawyer",
  },
  {
    id: "bankruptcy_lawyer",
    value: "Bankruptcy Lawyer",
  },
];
const logginIn = ref<boolean>(false);
const loginForm = ref<any>(null);
const registerNow = () => {
  loginForm.value.validate().then(async (success: Boolean) => {
    if (success) {
      logginIn.value = true;
      const payload = useFormData(loginModel.value);
      await axiosApiClient.post(`/user/signup`, payload).then((res) => {
        userStore.user.data = res.data.data;
        userStore.user.token = res.data.data.token;
        notify("successfully logged in", "dark", "check_circle");
        router.push({
          path: "/",
        });
      }).catch(() => logginIn.value = false);
      
      logginIn.value = false;
    }
  });
};
onMounted(() => {});
</script>
<style lang="scss" scoped>
.loginContainer {
  width: 100%;
  min-height: 100vh;
}
.bg-purple-custom {
  background: linear-gradient(90deg, white 0 50%, #fbc02d 50% 100%);
}
</style>
