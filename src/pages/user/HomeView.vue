<template lang="">
  <div style="height: 100vh; padding: 40px">
    <div class="row q-col-gutter-md">
      <div class="col col-md-3">
        <q-card class="bg-grey-5">
          <q-card-section>
            <div class="row">
              <p class="text-h2 q-mb-none">{{ totalCases }}</p>
              <p>Total Cases</p>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col col-md-3">
        <q-card class="bg-yellow-5">
          <q-card-section>
            <div class="row">
              <p class="text-h2 q-mb-none">{{ pendingCases }}</p>
              <p>Pending Cases</p>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col col-md-3">
        <q-card class="bg-green-5">
          <q-card-section>
            <div class="row">
              <p class="text-h2 q-mb-none">{{ progressCases }}</p>
              <p>In progress Cases</p>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col col-md-3">
        <q-card class="bg-red-5">
          <q-card-section>
            <div class="row">
              <p class="text-h2 q-mb-none">{{ closedCases }}</p>
              <p>Closed Cases</p>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import axiosApiClient from "@/axios";
import { ref, onMounted, computed } from "vue";

const cases = ref([]);
const totalCases = computed(() => {
  return cases.value.length
});
const pendingCases = computed(() => {
  let res = cases.value.filter(c => c.status == 0)
  return res.length
});
const progressCases = computed(() => {
  let res = cases.value.filter(c => c.status == 1)
  return res.length
});
const closedCases = computed(() => {
  let res = cases.value.filter(c => c.status == 3)
  return res.length
});

onMounted(() => {
  axiosApiClient.get("/cases/all").then((res) => {
    cases.value = res.data.data;
  });
});
</script>
<style lang="">
  
</style>