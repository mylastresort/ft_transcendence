import { Dispatch, createContext } from 'react';
import { Socket } from 'socket.io-client';
import { Action } from './game.reducer';

export const SocketContext = createContext(null as Socket | null);

export const DispatchContext = createContext(null as Dispatch<Action> | null);

export type Player = {
  wins;
  level;
  user;
};

export const PlayerContext = createContext(null as Player | null);

export const MapsContext = createContext([
  {
    name: 'Cyberpunk',
    url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp6852825.jpg&f=1&nofb=1&ipt=30c60ba3899b314af3f1806bcad2346845112f9d1b07a95f62fdfc2fc004fea0&ipo=images',
  },
  {
    name: 'Space',
    url: 'https://i.pinimg.com/originals/ed/1f/fd/ed1ffdbc5fc8e0c11aa32089e8cb23df.png',
  },
  {
    name: 'Classic',
    url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpdroms.de%2Fwp-content%2Fuploads%2F2018%2F03%2FPing-Pong-ClassicTable-Tennis-v1.44-Android-Game.png&f=1&nofb=1&ipt=0dd6f4e1905fdc7c62c99795314939be111705ee6e257931e3389ea0812cbe31&ipo=images',
  },
  {
    name: 'Galaxy',
    url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages5.alphacoders.com%2F633%2F633151.jpg&f=1&nofb=1&ipt=63b9babb40b21bbcd6ad5db8d4c62c01f9ff67e136783232e01f025edd97b3ee&ipo=images',
  },
  {
    name: 'Puzzle',
    url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F95%2F8d%2F4d%2F958d4d4b90ff22ff18496a0916b25a9d.jpg&f=1&nofb=1&ipt=6e6451749adbe05c0cb001b9c34c724be5362c32d7a96ba6ac1ae38716d32acc&ipo=images',
  },
]);
