import {
  MouseEventHandler,
  MutableRefObject,
  useContext,
  useEffect,
} from 'react';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../context';

export default function usePlayers(
  Host: MutableRefObject<HTMLDivElement>,
  Guest: MutableRefObject<HTMLDivElement>,
  paddle: number,
  height: number,
  role: 'host' | 'guest' | null
) {
  const socket = useContext(SocketContext) as Socket;

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    const top = event.currentTarget.getBoundingClientRect().top;
    return requestAnimationFrame(() => {
      const next = top + height / 2 - event.clientY;
      if (Math.abs(next) < height / 2 - paddle / 2) {
        socket.emit('move', next, () =>
          (role === 'host' ? Host : Guest).current.style.setProperty(
            '--player-y',
            `${next}px`
          )
        );
      }
    });
  };

  useEffect(() => {
    if (Host.current && Guest.current)
      socket.on('moved', (crd) =>
        requestAnimationFrame(() =>
          (role === 'host' ? Guest : Host).current.style.setProperty(
            '--player-y',
            `${crd}px`
          )
        )
      );
    return () => {
      socket.off('moved');
    };
  }, [Guest, Host, role, socket]);

  return { handleMouseMove };
}
