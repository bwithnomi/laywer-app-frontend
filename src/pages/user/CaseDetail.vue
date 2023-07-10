<template lang="">
  <div style="min-height: 100vh; padding: 40px">
    <div class="row justify-center" v-if="loading">
      <q-spinner-cube color="orange" size="2.5em" />
    </div>
    <div class="row q-col-gutter-x-md" v-else>
      <div class="col col-md-5">
        <q-card>
          <q-card-section>
            <p class="text-h4">{{ userCase.title }}</p>
            <p class="q-mb-none">
              Created on:
              {{ moment(userCase.createdAt).format(" MMM DD, YYYY") }}
            </p>
            <p class="q-mb-none">
              Status:
              <strong>{{
                (userCase.status == 0 && "pending") ||
                (userCase.status == 1 && "In progress") ||
                (userCase.status == 2 && "Rejected") ||
                (userCase.status == 3 && "Closed")
              }}</strong>
            </p>
            <p class="q-mb-none">Description: {{ userCase.description }}</p>
          </q-card-section>
        </q-card>

        <q-card
          class="q-mt-md"
          v-if="userStore.user.data.role == 'lawyer' && userCase.status == 0"
        >
          <q-card-section class="column">
            <p class="text-h6 text-center">Accept this case.</p>
            <q-btn
              label="Accept"
              no-caps
              color="dark"
              @click="changeCaseStatus(1)"
            ></q-btn>
          </q-card-section>
        </q-card>

        <q-card
          class="q-mt-md"
          v-if="userStore.user.data.role == 'lawyer' && userCase.status == 0"
        >
          <q-card-section class="column">
            <p class="text-h6 text-center">Reject this case.</p>
            <q-btn
              label="Reject"
              no-caps
              color="red"
              @click="changeCaseStatus(2)"
            ></q-btn>
          </q-card-section>
        </q-card>

        <q-card class="q-mt-md" v-if="userCase.status == 1">
          <q-card-section class="column">
            <p class="text-h6 text-center">Close this case.</p>
            <q-btn
              label="Close"
              no-caps
              color="green"
              @click="changeCaseStatus(3)"
            ></q-btn>
          </q-card-section>
        </q-card>

        <q-card
          class="q-mt-md"
          v-if="
            userCase.status == 3 &&
            userStore.user.data.role == 'user' &&
            userCase.reviews.length == 0
          "
        >
          <q-card-section class="column">
            <p class="text-h6 text-center">Add a Review</p>
            <div class="row justify-center q-mb-md">
              <q-rating
                v-model="reviewModel.rating"
                max="5"
                size="3.5em"
                color="yellow-8"
                icon="star_border"
                icon-selected="star"
                icon-half="star_half"
                no-dimming
              />
            </div>
            <FormInput
              :isInputLabelShow="false"
              v-model="reviewModel.feedback"
              placeHolder="Write a feedback*"
              label="Feedback"
              :rules="[rules.required]"
              :multiple="true"
              :isInput="true"
              inputType="textarea"
              :option="[]"
              height="100px"
            ></FormInput>
            <q-btn
              label="Submit"
              no-caps
              color="dark"
              @click="addReview"
            ></q-btn>
          </q-card-section>
        </q-card>
        <q-card
          class="q-mt-md"
          v-if="
            userCase.status == 3 &&
            userCase.reviews.length > 0
          "
        >
          <q-card-section class="column">
            <p class="text-h6 text-center">User Review</p>
            <p class="row items-center"><span>Rating:</span> 
              <q-rating
                v-model="userCase.reviews[0].rating"
                size="2em"
                color="orange"
                readonly
              />
            </p>
            <p>Feedback: {{ userCase.reviews[0].feedback }}</p>
          </q-card-section>
        </q-card>
        <q-card
          class="q-mt-md"
          v-if="
            (userCase.status == 1 || userCase.status == 3)
          "
        >
          <q-card-section class="column">
            <div class="row justify-between items-center">
              <p class="text-h6">Case Documents</p>
              <q-btn
                label="Add"
                color="dark"
                icon="add"
                no-caps
                @click="addDocument = true"
                v-if="userCase.status == 1"
              ></q-btn>
            </div>
            <div class="">
            <div
              class=""
              v-for="(document, index) in userCase.documents"
              :key="index"
            >
              <p class="q-mb-none">
                Uploaded at:
                {{ moment(document.createdAt).format("MMM DD, YYYY - hh:mm a") }}
              </p>
              <p>Download:<a target="_blank" :href="baseBackendUrl+'/'+document.document">{{ document.document.split("public/user/case/documents/")[1].slice(0,4)+"..."+document.document.split("public/user/case/documents/")[1].slice(document.document.split("public/user/case/documents/")[1].length-8,document.document.split("public/user/case/documents/")[1].length) }}</a>
                <!-- <q-btn size="sm" icon="download" color="red" @click="downloadFile(baseBackendUrl+'/'+document.document, document.document.split('public/user/case/documents/')[1])"></q-btn> -->
              </p>
            </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col col-md-6">
        <q-card>
          <q-card-section v-if="userCase.user._id == userStore.user.data._id">
            <div class="row q-col-gutter-x-xl">
              <div class="">
                <p class="text-h6">Lawyer Details</p>

                <q-avatar size="80px">
                  <img :src="showImage(userCase.lawyer.profile_image)" />
                </q-avatar>
              </div>

              <div class="col">
                <p class="q-mb-none text-capitalize">
                  <strong>Name:</strong> {{ userCase.lawyer.name }}
                </p>
                <p class="q-mb-none">
                  <strong>Email:</strong> {{ userCase.lawyer.email }}
                </p>
                <p class="q-mb-none text-capitalize">
                  <strong>Type:</strong> {{ userCase.lawyer.lawyer_type }}
                </p>
                <p class="text-capitalize">
                  <strong>Court:</strong> {{ userCase.lawyer.court_type }}
                </p>
                <q-btn
                  label="Message"
                  color="yellow-8"
                  unelevated
                  no-caps
                  icon="chat"
                  size="md"
                  @click="startConversation(userCase.lawyer._id)"
                ></q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section v-else>
            <p class="text-h6">User Details</p>

            <q-avatar size="80px">
              <img :src="showImage(userCase.user.profile_image)" />
            </q-avatar>
            <p class="q-mb-none text-capitalize">
              <strong>Name:</strong> {{ userCase.lawyer.name }}
            </p>
            <p class=""><strong>Email:</strong> {{ userCase.lawyer.email }}</p>
            <q-btn
              label="Message"
              color="yellow-8"
              unelevated
              no-caps
              icon="chat"
              size="md"
              @click="startConversation(userCase.lawyer._id)"
            ></q-btn>
          </q-card-section>
        </q-card>
        <q-card class="q-mt-md">
          <q-card-section>
            <div class="row justify-between items-center">
              <p class="text-h6">Updates</p>
              <q-btn
                label="Add"
                color="dark"
                icon="add"
                no-caps
                @click="addUpdate = true"
                v-if="userCase.status == 1"
              ></q-btn>
            </div>

            <div
              class=""
              v-for="(hearing, index) in userCase.hearings"
              :key="index"
            >
              <p class="q-mb-none">
                Update at:
                {{ moment(hearing.createdAt).format("MMM DD, YYYY - hh:mm a") }}
              </p>
              <p>Notes: {{ hearing.note }}</p>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>


  <q-dialog v-model="addDocument" no-backdrop-dismiss>
    <q-card style="max-width: 450px; width: 100%">
      <q-card-section>
        <p class="text-h6">Add Document</p>
        <q-file
          outlined
          dense
          rounded
          class="q-mb-sm"
          :isInputLabelShow="false"
          v-model="caseDocModel.doc"
          label="Document"
          :rules="[rules.required]"
        ></q-file>
        <div class="row justify-between">
          <q-btn label="Close" @click="addDocument = false" no-caps flat></q-btn>
          <q-btn
            label="Save"
            no-caps
            color="dark"
            @click="addNewDocument"
            :loading="adding"
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="addUpdate" no-backdrop-dismiss>
    <q-card style="max-width: 450px; width: 100%">
      <q-card-section>
        <p class="text-h6">Add an update</p>
        <FormInput
          :isInputLabelShow="false"
          v-model="hearingModel.hearing_date"
          placeHolder="Select a date*"
          label="Date"
          :rules="[rules.required]"
          :multiple="true"
          :isInput="true"
          inputType="date"
          :option="[]"
        ></FormInput>
        <FormInput
          :isInputLabelShow="false"
          v-model="hearingModel.note"
          placeHolder="Write a note*"
          label="Note"
          :rules="[rules.required]"
          :multiple="true"
          :isInput="true"
          inputType="textarea"
          :option="[]"
          height="100px"
        ></FormInput>
        <div class="row justify-between">
          <q-btn label="Close" @click="addUpdate = false" no-caps flat></q-btn>
          <q-btn
            label="Save"
            no-caps
            color="dark"
            @click="addNewUpdate"
            :loading="adding"
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import axiosApiClient from "@/axios";
import userPlaceholder from "@/assets/user.svg";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import rules from "@/composables/validationRules";
import moment from "moment";
import { useUserStore } from "@/stores/user";
import FormInput from "@/partials/FormInput.vue";
import useFormData from "@/composables/formdate";

const myAnchor = ref(null)
const baseBackendUrl = import.meta.env.VITE_BACKEND_URL;
const addingReview = ref(false);
const adding = ref(false);
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const userCase = ref({});
const addUpdate = ref(false);
const addDocument = ref(false);
const conversations = ref([]);
const loading = ref(true);
const hearingModel = ref({
  note: "",
  hearing_date: "",
});
const reviewModel = ref({
  rating: "",
  feedback: "",
});
const caseDocModel = ref({
  doc: "",
})
const showImage = (image: any) => {
  if (image && image != "") {
    if (image.includes("https:")) return image;
    return `${import.meta.env.VITE_BACKEND_URL}/${image}`;
  } else {
    return userPlaceholder;
  }
};
const startConversation = (receiver_id: string | number) => {
  router.push({ path: "/chat", query: { user: receiver_id } });
};
const downloadFile = async (url: string, fileName: string) => {

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}
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

const changeCaseStatus = async (status: any) => {
  await axiosApiClient
    .post("/case/change-status", { status, case_id: route.params.id })
    .then((res) => {
      userCase.value.status = status;
    });
};
const addNewUpdate = async () => {
  adding.value = true;
  await axiosApiClient
    .post("/case/create-hearing", {
      ...hearingModel.value,
      case_id: route.params.id,
    })
    .then((res) => {
      userCase.value.hearings.push(res.data.data);
    });
  adding.value = false;
  addUpdate.value = false;
};
const addNewDocument = async () => {
  adding.value = true;
  let formData = useFormData({ ...caseDocModel.value, case_id: userCase.value?._id });
  await axiosApiClient
    .post("/case/add-document", formData)
    .then((res) => {
      userCase.value.documents.push(res.data.data);
    });
  adding.value = false;
  addDocument.value = false;
}
const addReview = async () => {
  addingReview.value = true;
  await axiosApiClient
    .post("/case/create-review", {
      ...reviewModel.value,
      case_id: route.params.id,
      lawyer: userCase.value.lawyer._id,
    })
    .then((res) => {
      userCase.value.reviews.push(res.data.data);
    });
  addingReview.value = false;
};
onMounted(async () => {
  await axiosApiClient
    .post("/case/get", { case_id: route.params.id })
    .then((res) => {
      userCase.value = res.data.data;
    });
  await axiosApiClient
    .post(`/user/get-conversations`)
    .then(async (res) => {
      conversations.value = res.data.data;
    })
    .catch(() => { });
  loading.value = false;
});
</script>
<style lang=""></style>
