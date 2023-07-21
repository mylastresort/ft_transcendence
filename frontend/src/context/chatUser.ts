import { createContext } from 'react';

export interface chatUser {
  id: number;
  imgProfile: string;
  level: number;
  username: string;
}

export const UserContext = createContext({} as chatUser);
