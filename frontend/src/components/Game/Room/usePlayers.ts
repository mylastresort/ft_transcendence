import { GameContext } from '@/context/game';
import { MouseEventHandler, useContext, useEffect } from 'react';

export default function usePlayers(
  Host,
  Guest,
  mapPaddle,
  role,
  canvas,
  mapHeight,
  finished
) {
  const game = useContext(GameContext);

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    return requestAnimationFrame(() => {
      if (!Host.current || !Guest.current || finished.current) return;
      const { top, height } = canvas.current.getBoundingClientRect();
      const next = top + height / 2 - event.clientY;
      if (Math.abs(next) < height / 2 - (mapPaddle * height) / mapHeight / 2) {
        game.socket?.emit('move', -((next * mapHeight) / height), () =>
          (role === 'host' ? Host : Guest).current.style.setProperty(
            '--player-y',
            `${-next}px`
          )
        );
      }
    });
  };

  useEffect(() => {
    if (Host.current && Guest.current)
      game.socket?.on('moved', (crd) =>
        requestAnimationFrame(() =>
          (role === 'host' ? Guest : Host).current.style.setProperty(
            '--player-y',
            `${
              (crd * canvas.current.getBoundingClientRect().height) / mapHeight
            }px`
          )
        )
      );
    return () => {
      game.socket?.off('moved');
    };
  }, [Guest, Host, role, game.socket]);

  return { handleMouseMove };
}
