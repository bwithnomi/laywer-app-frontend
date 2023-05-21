<template lang="">
  <div style="height: 100vh; padding: 40px">
    <div class="row q-col-gutter-x-md">
      <div class="col-md-4 col">
        <q-card class="">
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-auto">
                <q-avatar size="80px">
                  <img :src="showImage(userStore.user.data.profile_image)" />
                </q-avatar>
              </div>
              <div class="col-auto" style="overflow: hidden">
                <p class="text-capitalize text-bold q-mb-none">
                  {{ userStore.user.data.name }}
                </p>
                <p class="text-grey-8 text-bold q-mb-none">
                  {{ userStore.user.data.email }}
                </p>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-8 col">
        <q-card class="">
          <q-card-section>
            <q-splitter v-model="splitterModel" style="height: 250px">
              <template v-slot:before>
                <q-tabs v-model="tab" vertical class="text-dark">
                  <q-tab name="case" icon="work" label="Case" no-caps />
                </q-tabs>
              </template>

              <template v-slot:after>
                <q-tab-panels
                  v-model="tab"
                  animated
                  swipeable
                  vertical
                  transition-prev="jump-up"
                  transition-next="jump-up"
                >
                  <q-tab-panel name="case">
                    <div class="">
                      <div class="row justify-between items-start">
                        <p class="text-h6">All Cases</p>
                        <q-btn
                          label="Add Case"
                          color="dark"
                          @click="addCase = true"
                          no-caps
                          v-if="userStore.user.data.role == 'user'"
                        ></q-btn>
                      </div>
                      <div class="">
                        <div
                          class=""
                          v-for="(eachCase, caseIndex) in cases"
                          :key="caseIndex"
                        >
                          <p class="text-subtitle1 text-capitalize text-bold">
                            {{ eachCase.title }}
                            <q-btn
                              :to="{
                                name: 'case-detail',
                                params: { id: eachCase._id },
                              }"
                              label="View Details"
                              no-caps
                              size="sm"
                              color="yellow-8"
                              unelevated
                            ></q-btn>
                          </p>
                          <p class="q-mb-none">
                            Status:
                            <strong>{{
                              (eachCase.status == 0 && "pending") ||
                              (eachCase.status == 1 && "In progress") ||
                              (eachCase.status == 2 && "Rejected") ||
                              (eachCase.status == 3 && "Closed")
                            }}</strong>
                          </p>
                          <p>Description: {{ eachCase.description }}</p>
                        </div>
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
  <q-dialog v-model="addCase" no-backdrop-dismiss>
    <q-card style="max-width: 420px; width: 100%">
      <q-form @submit.prevent ref="caseForm" :greedy="true">
        <q-card-section>
          <p>Add new case</p>
          <FormInput
            :isInputLabelShow="false"
            v-model="caseModel.title"
            placeHolder="Enter case title*"
            label="Case Title"
            :rules="[rules.required]"
            :multiple="true"
            :isInput="true"
            inputType="text"
            :option="[]"
          ></FormInput>
          <FormInput
            :isInputLabelShow="false"
            v-model="caseModel.lawyer"
            placeHolder="Select Lawyer*"
            label="Lawyer"
            :rules="[rules.required]"
            :multiple="false"
            :isInput="false"
            inputType="select"
            optionvalue="_id"
            optionlabel="name"
            :option="allLawyers"
          ></FormInput>
          <FormInput
            :isInputLabelShow="false"
            v-model="caseModel.description"
            placeHolder="Enter case title*"
            label="Case Description"
            :rules="[rules.required]"
            :multiple="true"
            :isInput="true"
            inputType="textarea"
            :option="[]"
          ></FormInput>
          <div class="row justify-between items-center">
            <q-btn label="Close" @click="addCase = false" no-caps flat></q-btn>
            <q-btn
              label="Save"
              no-caps
              color="dark"
              @click="addNewCase"
              :loading="adding"
            ></q-btn>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useUserStore } from "@/stores/user";
import userPlaceholder from "@/assets/user.svg";
import { ref, onMounted } from "vue";
import rules from "@/composables/validationRules";
import FormInput from "@/partials/FormInput.vue";
import axiosApiClient from "@/axios";

const adding = ref(false);
const allLawyers = ref([]);
const cases = ref([]);
const userStore = useUserStore();
const tab = ref("case");
const caseForm = ref();
const addCase = ref(false);
const splitterModel = ref(10);
const caseModel = ref({
  title: "",
  lawyer: "",
  description: "",
  media: "",
});
const showImage = (image) => {
  if (image && image != "") {
    if (image.includes("https:")) return image;
    return `${import.meta.env.VITE_BACKEND_URL}/${image}`;
  } else {
    return userPlaceholder;
  }
};

const addNewCase = async () => {
  caseForm.value.validate().then(async (success) => {
    if (success) {
      adding.value = true;
      await axiosApiClient
        .post("/case/create", { ...caseModel.value })
        .then((res) => {
          cases.value.unshift(res.data.data);
        });
      adding.value = false;
      addCase.value = false;
    }
  });
};

onMounted(() => {
  axiosApiClient.get("/lawyer/all").then((res) => {
    allLawyers.value = res.data.data;
  });
  axiosApiClient.get("/cases/all").then((res) => {
    cases.value = res.data.data;
  });
});
</script>
<style lang=""></style>
