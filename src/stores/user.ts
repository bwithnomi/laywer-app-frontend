import { defineStore } from 'pinia';
import type { ChatUser } from "@/interfaces";
export interface UserState {
  searchString: string,
  user: {
    data: ChatUser | null,
    token: null | string,
  }
}



export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    searchString: '',
    user: {
      data: null,
      token: null,
    }
  }),
  getters: {
    userData: (state) => state.user.data,
  },
  actions: {
    getToken() {
      this.user.token
    },
  },
  persist: true

})
