import { MutableRefObject, useContext, useEffect } from 'react';
import { SocketContext } from '../context';
import { Socket } from 'socket.io-client';

export default function useBall(
  Ball: MutableRefObject<HTMLDivElement>,
  Host: MutableRefObject<HTMLDivElement>,
  Guest: MutableRefObject<HTMLDivElement>,
  width: number,
  paddle: number,
  speed: number,
  rAFball: MutableRefObject<number>,
  cord: MutableRefObject<{ [key: string]: number[] }>,
  allow: MutableRefObject<boolean>
) {
  const socket = useContext(SocketContext) as Socket;

  useEffect(() => {
    if (Ball.current && Host.current && Guest.current) {
      socket
        .on('reset', () => {
          Ball.current.style.setProperty('--ball-x', '0px');
          Ball.current.style.setProperty('--ball-y', '0px');
          cord.current['--ball-x'] = [0, 0];
          cord.current['--ball-y'] = [0, 0];
        })
        .on('ping', ([right, top, dx, dy], key) => {
          cancelAnimationFrame(rAFball.current);
          Ball.current.style.setProperty(
            '--ball-x',
            `${cord.current['--ball-x'][0]}px`
          );
          Ball.current.style.setProperty(
            '--ball-y',
            `${cord.current['--ball-y'][0]}px`
          );
          cord.current['--ball-x'] = [right, dx];
          cord.current['--ball-y'] = [top, dy];
          rAFball.current = (function move() {
            return requestAnimationFrame(() => {
              if (
                Object.entries(cord.current).reduce(
                  (_done, [name, [max, lsz]]) => {
                    const cur = Number(
                      Ball.current.style.getPropertyValue(name).slice(0, -2)
                    );
                    if (cur === max) return _done;
                    const next = cur + lsz * speed;
                    const clamp = lsz > 0 ? Math.min : Math.max;
                    Ball.current.style.setProperty(
                      name,
                      `${clamp(max, next)}px`
                    );
                    return next === max;
                  },
                  true
                )
              ) {
                socket.emit('pong', key);
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
                    paddle / 2 <
                    Math.abs(Math.abs(BallY) - Math.abs(Player))
                  ) {
                    allow.current = false;
                    Object.values(cord.current).forEach(
                      (cur) => (cur[0] += 50 * Math.sign(cur[1]))
                    );
                    rAFball.current = (function animateLoss() {
                      return requestAnimationFrame(
                        () =>
                          !Object.entries(cord.current).reduce(
                            (_done, [name, [max, lsz]]) => {
                              const cur = Number(
                                Ball.current.style
                                  .getPropertyValue(name)
                                  .slice(0, -2)
                              );
                              if (cur === max) return _done;
                              const next = cur + lsz * speed;
                              const clamp = lsz > 0 ? Math.min : Math.max;
                              Ball.current.style.setProperty(
                                name,
                                `${clamp(max, next)}px`
                              );
                              return next === max;
                            },
                            true
                          ) && (rAFball.current = animateLoss())
                      );
                    })();
                  }
                }
              } else rAFball.current = move();
            });
          })();
        });
    }

    return () => {
      socket.off('ping').off('reset');
    };
  }, [paddle, socket, width]);
}
