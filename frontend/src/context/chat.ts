import { createContext } from 'react';

export interface Chat {
  data: {
    id: number;
    name: string;
    img: string;
    ownerId?: number;
  };
}

export const ChatContext = createContext({} as Chat);
