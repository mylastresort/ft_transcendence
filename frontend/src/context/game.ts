import { createContext } from 'react';
import { Socket } from 'socket.io-client';

export const GameContext = createContext({
  config: {} as { limit; paddle; radius },
  gameId: '',
  opponent: {} as Player,
  ready: false,
  conf: {
    isInvite: false,
    map: 0 as number | string,
    speed: 5,
    games: 3,
    name: '',
  },
  role: '',
  winner: '',
  socket: null as Socket | null,
  gameStatus: '',
});

export type Player = {
  userId: number;
  userImgProfile: string;
  username: string;
  userLevel: number;
  userWins: number;
  userCurrentStreak: number;
  userLongestStreak: number;
};

export const PlayerContext = createContext(null as Player | null);

export const MapsContext = createContext<
  {
    backgroundOpacity: string;
    ballRadius: string;
    color: string;
    font: string;
    fontSize: string;
    guestColor: string;
    hostColor: string;
    name: string;
    playerRadius: string;
    preview: string;
    url: string;
  }[]
>([
  {
    backgroundOpacity: '0.2',
    ballRadius: '50%',
    color: 'linear-gradient(45deg, rgb(1, 143, 207), #25c4d0)',
    font: 'Creepster',
    fontSize: '1.5rem',
    guestColor: 'linear-gradient(45deg, rgb(1, 143, 207), #25c4d0)',
    hostColor: 'linear-gradient(45deg, rgb(1, 143, 207), #25c4d0)',
    name: 'Galaxy',
    playerRadius: '10px',
    preview: '/images/maps/planete-wallpaper.jpg',
    url: '/images/maps/planete-wallpaper.jpg',
  },
  {
    backgroundOpacity: '1',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    font: 'Orbitron',
    fontSize: '1.1rem',
    guestColor: 'linear-gradient(whitesmoke, whitesmoke)',
    hostColor: 'linear-gradient(whitesmoke, whitesmoke)',
    name: 'Classic',
    playerRadius: '2px',
    preview: '/images/maps/classic-preview.png',
    url: '/images/maps/classic-wallpaper.jpg',
  },
  {
    backgroundOpacity: '0.5',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    font: "'Bebas Neue'",
    fontSize: '1.5rem',
    guestColor: 'linear-gradient(blue, blue)',
    hostColor: 'linear-gradient(red, red)',
    name: 'Football',
    playerRadius: '10px',
    preview: '/images/maps/football-wallpaper.jpg',
    url: '/images/maps/football-wallpaper.jpg',
  },
]);
