import { createContext } from 'react';

export interface User {
  data: {
    id: number;
    imgProfile: string;
    level: number;
    username: string;
  };
}

export const UserContext = createContext({} as User);
