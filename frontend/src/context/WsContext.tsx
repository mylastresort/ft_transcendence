import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

let socketOptions = {};
export let UserSocket;
export const WsContext = createContext<Socket>(UserSocket);

export const WsProvider = ({ children, token }) => {
  const retrySocketConnection = (socket: Socket) => {
    socketOptions = {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    };
    UserSocket = io(process.env.BACKEND_DOMAIN + '/userws', socketOptions);
    UserSocket.on('connect', () => {
      return;
    });
  };

  retrySocketConnection(UserSocket);

  return <WsContext.Provider value={UserSocket}>{children}</WsContext.Provider>;
};
