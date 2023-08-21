import { createContext } from "react";
import {io, Socket} from 'socket.io-client'

export const socket = io('10.13.1.7:4400/chat');
export const ChatSocketContext = createContext<Socket>(socket);

export const ChatSocketProvider = ChatSocketContext.Provider;