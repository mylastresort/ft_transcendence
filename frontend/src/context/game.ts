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
    backgroundPosition: string;
  }[]
>([
  {
    backgroundOpacity: '1',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    font: 'Orbitron',
    fontSize: '1.1rem',
    guestColor: 'linear-gradient(whitesmoke, whitesmoke)',
    hostColor: 'linear-gradient(whitesmoke, whitesmoke)',
    name: 'Astronomy',
    playerRadius: '2px',
    preview: '/images/maps/astronomy.jpg',
    url: '/images/maps/astronomy.jpg',
    backgroundPosition: 'center',
  },
  {
    backgroundOpacity: '1',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    font: 'Orbitron',
    fontSize: '1.1rem',
    guestColor: 'linear-gradient(whitesmoke, whitesmoke)',
    hostColor: 'linear-gradient(whitesmoke, whitesmoke)',
    name: 'Cyberpunk',
    playerRadius: '2px',
    preview: '/images/maps/cyberpunk.jpg',
    url: '/images/maps/cyberpunk.jpg',
    backgroundPosition: 'center',
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
    backgroundPosition: 'center',
  },
  {
    backgroundOpacity: '1',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    font: 'Orbitron',
    fontSize: '1.1rem',
    guestColor: 'linear-gradient(whitesmoke, whitesmoke)',
    hostColor: 'linear-gradient(whitesmoke, whitesmoke)',
    name: 'WitchCraft',
    playerRadius: '2px',
    preview: '/images/maps/witchcraft.jpg ',
    url: '/images/maps/witchcraft.jpg',
    backgroundPosition: 'center',
  },
  {
    backgroundOpacity: '1',
    ballRadius: '50%',
    color: 'linear-gradient(whitesmoke, whitesmoke)',
    font: 'Orbitron',
    fontSize: '1.1rem',
    guestColor: 'linear-gradient(whitesmoke, whitesmoke)',
    hostColor: 'linear-gradient(whitesmoke, whitesmoke)',
    name: 'DragonBall',
    playerRadius: '2px',
    preview: '/images/maps/dragonball.jpg ',
    url: '/images/maps/dragonball.jpg',
    backgroundPosition: 'center',
  },
]);
