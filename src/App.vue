<template>
  <RouterView />
</template>
<script setup lang="ts">
// import { provide } from "vue";
import { RouterView } from "vue-router";
import { socket } from "@/socket";
socket.on("my broadcast", (data) => {
  console.log(data);
  
});
</script>
<style scoped></style>
