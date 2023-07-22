import { randomInt } from 'crypto';

import { Room } from './room.class';

export default class Ball {
  static readonly radius = 5;

  crd = [0, 0];

  private dir = [
    Math.sign(Math.random() - 0.5),
    Math.sign(Math.random() - 0.5),
  ];

  dummyKey = randomInt(1000);

  private hit(a1, a2) {
    const pr = [this.dir[1], -this.dir[0]];
    const ao = [this.crd[0] - a1[0], this.crd[1] - a1[1]];
    const ab = [a2[0] - a1[0], a2[1] - a1[1]];
    const den = ab[0] * pr[0] + ab[1] * pr[1];
    if (den === 0) return 0;
    const t1 = Math.abs(ab[0] * ao[1] + ab[1] * ao[0]) / den;
    const t2 = (ao[0] * pr[0] + ao[1] * pr[1]) / den;
    return t2 > 0 && t2 < 1 && t1 > 0 ? t1 : 0;
  }

  reset() {
    this.crd = [0, 0];
    this.dir = [1, 1];
    this.dummyKey = randomInt(1000);
  }

  ping() {
    const [right, top] = Room.edges;
    const dis =
      this.hit([-right, top], [right, top]) ||
      this.hit([right, top], [right, -top]) ||
      this.hit([right, -top], [-right, -top]) ||
      this.hit([-right, -top], [-right, top]);
    this.crd[0] += this.dir[0] * dis;
    this.crd[1] += this.dir[1] * dis;
    const [dx, dy] = this.dir;
    if (Math.abs(this.crd[0]) === right) this.dir[0] *= -1;
    if (Math.abs(this.crd[1]) === top) this.dir[1] *= -1;
    return [
      [this.crd[0], this.crd[1], Math.sign(dx), Math.sign(dy)],
      this.dummyKey,
    ] as const;
  }

  pong(key) {
    if (this.dummyKey !== key) return null;
    this.dummyKey = randomInt(1000);
    return this.ping();
  }
}
