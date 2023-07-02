import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

let socketOptions = {};
if (typeof window !== 'undefined') {
  // Running on the client-side
  const token = localStorage.getItem('jwtToken');
  socketOptions = {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export const UserSocket = io('http://localhost:4400/userws', socketOptions);
export const WsContext = createContext<Socket>(UserSocket);

export const WsProvider = WsContext.Provider;
