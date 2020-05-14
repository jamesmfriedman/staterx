import { createObject, createValue } from 'staterx';
import { interval, fromEvent } from 'rxjs';
import {
  tap,
  switchMap,
  debounceTime,
  map,
  distinctUntilKeyChanged
} from 'rxjs/operators';

/**************************************************
 * Types
 **************************************************/
type Rect = { width: number; height: number; x: number; y: number };

/**************************************************
 * Constants
 **************************************************/
const PADDLE_MARGIN = 128;
const FPS = 60;

/**************************************************
 * Utils
 **************************************************/
const hittest = (a: Rect, b: Rect) =>
  !(
    a.y + a.height < b.y ||
    a.y > b.y + b.height ||
    a.x + a.width < b.x ||
    a.x > b.x + b.width
  );

const getDeflectionAngle = (r1: Rect, r2: Rect) => {
  const diff = Math.max(0, r2.y - r1.y - r2.height + r2.height / 2) * 2;
  const dir = diff / r1.height - 1;
  return Math.max(-1, Math.min(1, dir));
};

const getRandomFloat = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const getRandomBool = () => Math.random() >= 0.5;

/**************************************************
 * Observables
 **************************************************/
const loop$ = interval((1 / FPS) * 1000);
const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');
const keyUp$ = fromEvent<KeyboardEvent>(document, 'keyup');
const windowResize$ = fromEvent(window, 'resize').pipe(debounceTime(200));

/**************************************************
 * States
 **************************************************/
const speed = createValue(500 / FPS, {
  effects: ({ set }) => ({ increase: () => set((val) => val * 1.1) })
});

export const board = createObject({
  width: window.innerWidth,
  height: window.innerHeight
});

export const ball = createObject(
  {
    x: board.get().width / 2 - 16,
    y: board.get().height / 2 - 16,
    width: 32,
    height: 32,
    dirX: getRandomBool() ? 1 : -1,
    dirY: getRandomFloat(-1, 1)
  },
  {
    effects: () => {
      return {
        serve: () => {
          speed.reset();
          ball.merge({
            x: board.get().width / 2 - 16,
            y: board.get().height / 2 - 16,
            dirX: getRandomBool() ? 1 : -1,
            dirY: getRandomFloat(-1, 1)
          });
        },
        tick: () => {
          const currSpeed = speed.get();
          const p1State = p1.get();
          const p2State = p2.get();
          const ballState = ball.get();
          const { width: boardWidth, height: boardHeight } = board.get();
          const { x, y, dirX, dirY, width, height } = ballState;

          const newY = y + dirY * currSpeed;

          const newBounds = {
            x: x + dirX * currSpeed,
            y: newY,
            dirY: newY < 0 || newY > boardHeight ? dirY * -1 : dirY,
            width,
            height
          };

          for (const p of [p1State, p2State]) {
            const isHit = hittest(p, newBounds);
            if (isHit) {
              speed.increase();
              return ball.merge({
                ...newBounds,
                dirX: dirX * -1,
                dirY: getDeflectionAngle(p, ballState)
              });
            }
          }

          if (x < 0 || x > boardWidth) {
            if (x < 0) p1.scorePoint();
            if (x > boardWidth) p2.scorePoint();
            return ball.serve();
          }

          ball.merge(newBounds);
        }
      };
    }
  }
);

const player = createObject(
  {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    moveDir: 0,
    score: 0
  },
  {
    effects: (p) => ({
      score$: p.state$.pipe(
        distinctUntilKeyChanged('score'),
        map((val) => val.score)
      ),
      moveUp: () => p.merge({ moveDir: -1 }),
      moveDown: () => p.merge({ moveDir: 1 }),
      stopMove: () => p.merge({ moveDir: 0 }),
      scorePoint: () =>
        p.set((state) => ({ ...state, score: state.score + 1 })),
      tick: () => {
        const { moveDir, y, height } = p.get();
        const s = speed.get();

        moveDir &&
          p.merge({
            y:
              moveDir === 1
                ? Math.min(board.get().height - height, y + s)
                : Math.max(0, y - s)
          });
      }
    })
  }
);

export const p1 = player.clone({
  x: PADDLE_MARGIN,
  y: board.get().height / 2 - 64,
  width: 16,
  height: 128,
  moveDir: 0,
  score: 0
});

export const p2 = player.clone({
  x: board.get().width - PADDLE_MARGIN,
  y: board.get().height / 2 - 64,
  width: 16,
  height: 128,
  moveDir: 0,
  score: 0
});

export const initGame = () => {
  // Handle the game loop
  const loopSub = loop$
    .pipe(
      tap(() => {
        ball.tick();
        p1.tick();
        p2.tick();
      })
    )
    .subscribe();

  // Bind player controls
  const keySub = keyDown$
    .pipe(
      map((evt) => evt.which),
      map((keycode) => {
        const player = [38, 40].includes(keycode) ? p2 : p1;

        switch (keycode) {
          case 38:
          case 87:
            player.moveUp();
            break;
          case 40:
          case 83:
            player.moveDown();
            break;
        }
        return player;
      }),
      switchMap((player) => keyUp$.pipe(tap(() => player.stopMove())))
    )
    .subscribe();

  // Handle window resizing
  const windowSub = windowResize$.subscribe(() => {
    board.set({
      width: window.innerWidth,
      height: window.innerHeight
    });

    p2.merge({ x: board.get().width - PADDLE_MARGIN });
  });

  return () => [loopSub, keySub, windowSub].map((sub) => sub.unsubscribe());
};
