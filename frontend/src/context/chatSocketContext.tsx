import { createContext } from "react";
import {io, Socket} from 'socket.io-client'


export const ChatSocketContext = createContext<Socket>(undefined!);
