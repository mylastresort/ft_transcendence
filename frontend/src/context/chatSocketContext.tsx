import { createContext } from "react";
import {io, Socket} from 'socket.io-client'

export const socket = io('localhost:4400/chat');
export const ChatSocketContext = createContext<Socket>(socket);

export const ChatSocketProvider = ChatSocketContext.Provider;