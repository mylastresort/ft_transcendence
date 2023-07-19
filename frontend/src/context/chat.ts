import { createContext } from 'react';

export interface Chat {
  data: {
    id: number;
    name: string;
    img: string;
    createdAt: string;
    isChannel: boolean;
  };
}

export const ChatContext = createContext({} as Chat);
