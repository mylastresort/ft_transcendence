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
    backgroundPosition: string;
    gamesFont: string;
    ballColor: string;
  }[]
>([
  {
    backgroundOpacity: '1',
    ballRadius: '50%',
    color: '#e9a852',
    font: 'Distant Galaxy',
    fontSize: '1.1rem',
    guestColor: 'linear-gradient(#e9a852, #e9a852)',
    hostColor: 'linear-gradient(#e9a852, #e9a852)',
    ballColor: 'linear-gradient(#e9a852, #e9a852)',
    name: 'StarWars',
    playerRadius: '2px',
    preview: '/images/maps/astronomy5.png',
    url: '/images/maps/astronomy5.png',
    backgroundPosition: 'center',
    gamesFont: 'Distant Galaxy',
  },
  {
    backgroundOpacity: '1',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    font: "'Doctor Glitch'",
    fontSize: '1.1rem',
    guestColor: 'linear-gradient(whitesmoke, whitesmoke)',
    hostColor: 'linear-gradient(whitesmoke, whitesmoke)',
    ballColor: 'linear-gradient(whitesmoke, whitesmoke)',
    name: 'Cyberpunk',
    playerRadius: '2px',
    preview: '/images/maps/cyberpunk.jpg',
    url: '/images/maps/cyberpunk.jpg',
    backgroundPosition: 'center',
    gamesFont: "'Doctor Glitch'",
  },
  {
    backgroundOpacity: '1',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    font: "'Upheaval TT (BRK)'",
    fontSize: '1.1rem',
    guestColor: 'linear-gradient(whitesmoke, whitesmoke)',
    hostColor: 'linear-gradient(whitesmoke, whitesmoke)',
    ballColor: 'linear-gradient(whitesmoke, whitesmoke)',
    name: 'Classic',
    playerRadius: '2px',
    preview: '/images/maps/classic-preview.png',
    url: '/images/maps/classic-wallpaper.jpg',
    backgroundPosition: 'center',
    gamesFont: "'Upheaval TT (BRK)'",
  },
  {
    backgroundOpacity: '1',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    font: "'Witch Party'",
    fontSize: '1.1rem',
    guestColor: 'linear-gradient(whitesmoke, whitesmoke)',
    hostColor: 'linear-gradient(whitesmoke, whitesmoke)',
    ballColor: 'linear-gradient(whitesmoke, whitesmoke)',
    name: 'WitchCraft',
    playerRadius: '2px',
    preview: '/images/maps/witchcraft.jpg ',
    url: '/images/maps/witchcraft.jpg',
    backgroundPosition: 'center',
    gamesFont: "'Nightcore Demo'",
  },
  {
    backgroundOpacity: '1',
    ballRadius: '50%',
    color: 'linear-gradient(#17badf, #17badf)',
    font: 'GROBOLD',
    fontSize: '1.1rem',
    guestColor: 'linear-gradient(#17badf, #17badf)',
    hostColor: 'linear-gradient(#17badf, #17badf)',
    ballColor: 'linear-gradient(#17badf, #17badf)',
    name: 'DragonBall',
    playerRadius: '2px',
    preview: '/images/maps/dragonball.jpg ',
    url: '/images/maps/dragonball.jpg',
    backgroundPosition: 'center',
    gamesFont: "'Saiyan Sans'",
  },
]);
