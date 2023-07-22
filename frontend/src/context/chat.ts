import { createContext } from 'react';

export interface Chat {
  data: {
    id: number;
    name: string;
    img: string;
    lastMsg: string;
  };
}

export const ChatContext = createContext({} as Chat);
