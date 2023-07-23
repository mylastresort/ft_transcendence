import { createContext } from 'react';

export interface User {
  data: {
    id: number,
    imgProfile: string,
    username: string,
    firstName: string,
    lastName: string,
    location: string,
    sammary: string,
    twoFactorAuth: Boolean,
    verified2FA: Boolean,
  };
}

export const UserContext = createContext({} as User);
