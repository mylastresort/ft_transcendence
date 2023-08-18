import { createContext } from 'react';

export interface Chat {
  data: {
    id: number;
    name: string;
    img: string;
    memberId?: number;
    me?: {
      id: number;
      nickname: string;
      joinedAt: number;
      isOwner: boolean;
      isAdministator: boolean;
      isMember: boolean;
      isBanned: boolean;
      bannedTime: number;
      isMuted: boolean;
      mutedTime: number;
      userId: number;
    };
  };
}

export const ChatContext = createContext({} as Chat);
