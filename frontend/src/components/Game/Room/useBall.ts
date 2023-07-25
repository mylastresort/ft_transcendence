import { GameContext } from '@/context/game';
import { MutableRefObject, useContext, useEffect } from 'react';

export default function useBall(
  Ball,
  Host,
  Guest,
  paddle,
  speed,
  rAFball,
  cord: MutableRefObject<{
    '--ball-x': number[];
    '--ball-y': number[];
  }>,
  allow,
  canvas,
  mapWidth,
  mapHeight
) {
  const game = useContext(GameContext);

  useEffect(() => {
    if (!Ball.current || !Host.current || !Guest.current) return;
    game.socket
      ?.on('reset', () => {
        Ball.current.style.setProperty('--ball-x', '0px');
        Ball.current.style.setProperty('--ball-y', '0px');
        cord.current['--ball-x'] = [0, 0];
        cord.current['--ball-y'] = [0, 0];
      })
      .on('ping', ([right, top, dx, dy], key) => {
        if (!Ball.current) return;
        cancelAnimationFrame(rAFball.current);
        const curX = cord.current['--ball-x'][0];
        if (Math.abs(curX) <= (right * canvas.current.width) / mapWidth)
          Ball.current.style.setProperty(
            '--ball-x',
            `${(right * canvas.current.width) / mapWidth}px`
          );
        const curY = cord.current['--ball-y'][0];
        if (Math.abs(curY) <= (top * canvas.current.height) / mapHeight)
          Ball.current.style.setProperty(
            '--ball-y',
            `${(top * canvas.current.height) / mapHeight}px`
          );
        cord.current['--ball-x'] = [right, dx];
        cord.current['--ball-y'] = [top, dy];
        rAFball.current = (function move() {
          return requestAnimationFrame(() => {
            if (!Ball.current) return;
            const { width, height } = canvas.current.getBoundingClientRect();
            if (
              Object.entries(cord.current).reduce(
                (_done, [name, [max, lsz]]) => {
                  const cur = Number(
                    Ball.current.style.getPropertyValue(name).slice(0, -2)
                  );
                  max =
                    name === '--ball-x'
                      ? (max * width) / mapWidth
                      : (max * height) / mapHeight;
                  if (cur === max) return _done;
                  const next =
                    cur +
                    (name === '--ball-x'
                      ? (lsz * width) / mapWidth
                      : (lsz * height) / mapHeight) *
                      speed;
                  const clamp = lsz > 0 ? Math.min : Math.max;
                  Ball.current.style.setProperty(name, `${clamp(max, next)}px`);
                  return next === max;
                },
                true
              )
            ) {
              cord.current['--ball-x'][0] = (right * width) / mapWidth;
              cord.current['--ball-y'][0] = (top * height) / mapHeight;
              game.socket?.emit('pong', key);
              if (!Ball.current || !canvas.current) return;
              const BallX = Number(
                Ball.current.style.getPropertyValue('--ball-x').slice(0, -2)
              );
              if (Math.abs(BallX) === width / 2) {
                const BallY = Number(
                  Ball.current.style.getPropertyValue('--ball-y').slice(0, -2)
                );
                const Player = Number(
                  (BallX < 0 ? Host : Guest).current.style
                    .getPropertyValue('--player-y')
                    .slice(0, -2)
                );
                if (
                  BallY > Player + (paddle * height) / mapHeight / 2 ||
                  BallY < Player - (paddle * height) / mapHeight / 2
                ) {
                  allow.current = false;
                  Object.values(cord.current).forEach(
                    (cur) => (cur[0] += 30 * speed * (cur[1] < 0 ? -1 : 1))
                  );
                  rAFball.current = (function animateLoss() {
                    return requestAnimationFrame(() => {
                      if (!Ball.current) return;
                      if (
                        !Object.entries(cord.current).reduce(
                          (_done, [name, [max, lsz]]) => {
                            const cur = Number(
                              Ball.current.style
                                .getPropertyValue(name)
                                .slice(0, -2)
                            );
                            if (cur === max) return _done;
                            const next =
                              cur +
                              (name === '--ball-x'
                                ? (lsz * width) / mapWidth
                                : (lsz * height) / mapHeight) *
                                speed;
                            const clamp = lsz > 0 ? Math.min : Math.max;
                            Ball.current.style.setProperty(
                              name,
                              `${clamp(max, next)}px`
                            );
                            return next === max;
                          },
                          true
                        )
                      )
                        rAFball.current = animateLoss();
                    });
                  })();
                }
              }
            } else rAFball.current = move();
          });
        })();
      });
    return () => {
      game.socket?.off('ping').off('reset');
    };
  }, [paddle, game.socket, canvas]);
}
