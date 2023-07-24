import { createContext } from 'react';
import { Socket } from 'socket.io-client';

export const GameContext = createContext({
  config: { limit: [180, 120], paddle: 80, radius: 1 },
  gameId: '',
  opponent: {
    userImgProfile: '',
    username: 'stamim',
  } as Player,
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
    backgroundPosition: string;
    ballColor: string;
    ballRadius: string;
    color: string;
    fillColor: string;
    font: string;
    fontSize: string;
    gamesFont: string;
    guestColor: string;
    hostColor: string;
    name: string;
    playerRadius: string;
    preview: string;
    url: string;
  }[]
>([
  {
    backgroundOpacity: '1',
    backgroundPosition: 'center',
    ballColor: 'linear-gradient(#e9a852, #e9a852)',
    ballRadius: '50%',
    color: '#e9a852',
    fillColor: '#e9a852',
    font: 'Distant Galaxy',
    fontSize: '1.1rem',
    gamesFont: 'Distant Galaxy',
    guestColor: 'linear-gradient(#e9a852, #e9a852)',
    hostColor: 'linear-gradient(#e9a852, #e9a852)',
    name: 'StarWars',
    playerRadius: '2px',
    preview: '/images/maps/astronomy5.png',
    url: '/images/maps/astronomy5.png',
  },
  {
    backgroundOpacity: '1',
    backgroundPosition: 'center',
    ballColor: 'linear-gradient(whitesmoke, whitesmoke)',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    fillColor: '#f5f5f5',
    font: "'Doctor Glitch'",
    fontSize: '1.1rem',
    gamesFont: "'Doctor Glitch'",
    guestColor: 'linear-gradient(whitesmoke, whitesmoke)',
    hostColor: 'linear-gradient(whitesmoke, whitesmoke)',
    name: 'Cyberpunk',
    playerRadius: '2px',
    preview: '/images/maps/cyberpunk.jpg',
    url: '/images/maps/cyberpunk.jpg',
  },
  {
    backgroundOpacity: '1',
    backgroundPosition: 'center',
    ballColor: 'linear-gradient(whitesmoke, whitesmoke)',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    fillColor: '#f5f5f5',
    font: "'Upheaval TT (BRK)'",
    fontSize: '1.1rem',
    gamesFont: "'Upheaval TT (BRK)'",
    guestColor: 'linear-gradient(whitesmoke, whitesmoke)',
    hostColor: 'linear-gradient(whitesmoke, whitesmoke)',
    name: 'Classic',
    playerRadius: '2px',
    preview: '/images/maps/classic-preview.png',
    url: '/images/maps/classic-wallpaper.jpg',
  },
  {
    backgroundOpacity: '1',
    backgroundPosition: 'center',
    ballColor: 'linear-gradient(whitesmoke, whitesmoke)',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    fillColor: '#f5f5f5',
    font: "'Witch Party'",
    fontSize: '1.1rem',
    gamesFont: "'Nightcore Demo'",
    guestColor: 'linear-gradient(whitesmoke, whitesmoke)',
    hostColor: 'linear-gradient(whitesmoke, whitesmoke)',
    name: 'WitchCraft',
    playerRadius: '2px',
    preview: '/images/maps/witchcraft.jpg ',
    url: '/images/maps/witchcraft.jpg',
  },
  {
    backgroundOpacity: '1',
    backgroundPosition: 'center',
    ballColor: 'linear-gradient(whitesmoke, whitesmoke)',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    fillColor: '#f5f5f5',
    font: 'GROBOLD',
    fontSize: '1.1rem',
    gamesFont: "'Saiyan Sans'",
    guestColor: 'linear-gradient(whitesmoke, whitesmoke)',
    hostColor: 'linear-gradient(whitesmoke, whitesmoke)',
    name: 'DragonBall',
    playerRadius: '2px',
    preview: '/images/maps/dragonball.jpg ',
    url: '/images/maps/dragonball.jpg',
  },
]);
