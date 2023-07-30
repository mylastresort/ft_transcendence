import { GameContext } from '@/context/game';
import { MouseEventHandler, useContext, useEffect } from 'react';

export default function usePlayers(
  Host,
  Guest,
  mapPaddle,
  role,
  canvas,
  mapHeight,
  finished,
  playersCurrent
) {
  const game = useContext(GameContext);

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    return requestAnimationFrame(() => {
      if (!Host.current || !Guest.current || finished.current) return;
      const { top, height } = canvas.current.getBoundingClientRect();
      const next = top + height / 2 - event.clientY;
      if (Math.abs(next) < height / 2 - (mapPaddle * height) / mapHeight / 2) {
        const pos = -((next * mapHeight) / height);
        playersCurrent.current[role] = pos;
        game.socket?.emit('move', pos, () =>
          (role === 'host' ? Host : Guest).current.style.setProperty(
            '--player-y',
            `${-next}px`
          )
        );
      }
    });
  };

  useEffect(() => {
    game.socket?.on('moved', (crd) =>
      requestAnimationFrame(() => {
        playersCurrent.current[role === 'host' ? 'guest' : 'host'] = crd;
        (role === 'host' ? Guest : Host).current?.style.setProperty(
          '--player-y',
          (crd * canvas.current.getBoundingClientRect().height) / mapHeight +
            'px'
        );
      })
    );
    function handleResize() {
      requestAnimationFrame(() => {
        Host.current?.style.setProperty(
          '--player-y',
          (playersCurrent.current.host *
            canvas.current.getBoundingClientRect().height) /
            mapHeight +
            'px'
        );
        Guest.current?.style.setProperty(
          '--player-y',
          (playersCurrent.current.guest *
            canvas.current.getBoundingClientRect().height) /
            mapHeight +
            'px'
        );
      });
    }
    window?.addEventListener('resize', handleResize);
    return () => {
      game.socket?.off('moved');
      window?.removeEventListener('resize', handleResize);
    };
  }, [Guest, Host, role, game.socket]);

  return { handleMouseMove };
}
