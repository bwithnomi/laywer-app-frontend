import axios from "axios";
import notify from '@/composables/notify'
import { useUserStore } from '@/stores/user';
import type { ValidationError } from "@/interfaces";

const axiosApiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});
axiosApiClient.interceptors.request.use(config => {
  const userStore = useUserStore();
  if (userStore.user.token) {
    config.headers.Authorization = `Bearer ${userStore.user.token}`
  }
  return config;
})
axiosApiClient.interceptors.response.use(response => {
  return response;
}, (error) => {
  console.log(error);
  if (error.code && error.code == 'ERR_NETWORK') {
    notify('Server not responding', 'negative', 'error');
  } else if (error.response.status == 422) {
    error.response.data.errors.forEach((eachError: ValidationError) => {
      notify(eachError.msg, 'negative', 'error');
    });
  } else if (error.response.status == 401) {
    notify('Unauthenticated user', 'negative', 'error');
  } else if (error.response.status == 500) {
    notify('Internal server error', 'negative', 'error');
  } else if (error.response.status == 403) {
    notify('Unauthorized action', 'negative', 'error');
  }

  throw error;
})

export default axiosApiClient;