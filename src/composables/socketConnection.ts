import { io } from 'socket.io-client';
// import { useUserStore } from '@/stores/user';

const socket = io(import.meta.env.VITE_APP_SOCKET_ENDPOINT, {
  reconnectionDelayMax: 10000,
});

export default socket;