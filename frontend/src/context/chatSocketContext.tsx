import { createContext } from "react";
import {io, Socket} from 'socket.io-client'


let socketOptions = {};
export let ChatSocket;
export const ChatSocketContext = createContext<Socket>(ChatSocket);

export const ChatSocketProvider = ({ children, token }) => {
  const retrySocketConnection = (socket: Socket) => {
    socketOptions = {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    };
    ChatSocket = io('http://10.13.1.7:4400/chat', socketOptions);
    ChatSocket.on('connect', () => {
      return;
    });
  };

  retrySocketConnection(ChatSocket);

  return <ChatSocketContext.Provider value={ChatSocket}>{children}</ChatSocketContext.Provider>;
};
