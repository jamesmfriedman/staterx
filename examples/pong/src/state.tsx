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

export const boardState = createObject({
  width: window.innerWidth,
  height: window.innerHeight
});

export const ballState = createObject(
  {
    x: boardState.get().width / 2 - 16,
    y: boardState.get().height / 2 - 16,
    width: 32,
    height: 32,
    dirX: getRandomBool() ? 1 : -1,
    dirY: getRandomFloat(-1, 1)
  },
  {
    effects: ({ merge, get }) => {
      return {
        serve: () => {
          speed.reset();
          merge({
            x: boardState.get().width / 2 - 16,
            y: boardState.get().height / 2 - 16,
            dirX: getRandomBool() ? 1 : -1,
            dirY: getRandomFloat(-1, 1)
          });
        },
        tick: () => {
          const currSpeed = speed.get();
          const p1 = p1State.get();
          const p2 = p2State.get();
          const ball = get();
          const { width: boardWidth, height: boardHeight } = boardState.get();
          const { x, y, dirX, dirY, width, height } = ball;

          const newY = y + dirY * currSpeed;

          const newBounds = {
            x: x + dirX * currSpeed,
            y: newY,
            dirY: newY < 0 || newY > boardHeight ? dirY * -1 : dirY,
            width,
            height
          };

          for (const p of [p1, p2]) {
            const isHit = hittest(p, newBounds);
            if (isHit) {
              speed.increase();
              return merge({
                ...newBounds,
                dirX: dirX * -1,
                dirY: getDeflectionAngle(p, ball)
              });
            }
          }

          if (x < 0 || x > boardWidth) {
            if (x < 0) p1State.scorePoint();
            if (x > boardWidth) p2State.scorePoint();
            return ballState.serve();
          }

          merge(newBounds);
        }
      };
    }
  }
);

const playerState = createObject(
  {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    moveDir: 0,
    score: 0
  },
  {
    effects: ({ state$, merge, get, set }) => ({
      score$: state$.pipe(
        distinctUntilKeyChanged('score'),
        map((val) => val.score)
      ),
      moveUp: () => merge({ moveDir: -1 }),
      moveDown: () => merge({ moveDir: 1 }),
      stopMove: () => merge({ moveDir: 0 }),
      scorePoint: () => set((state) => ({ ...state, score: state.score + 1 })),
      tick: () => {
        const { moveDir, y, height } = get();
        const s = speed.get();

        moveDir &&
          merge({
            y:
              moveDir === 1
                ? Math.min(boardState.get().height - height, y + s)
                : Math.max(0, y - s)
          });
      }
    })
  }
);

export const p1State = playerState.clone({
  x: PADDLE_MARGIN,
  y: boardState.get().height / 2 - 64,
  width: 16,
  height: 128,
  moveDir: 0,
  score: 0
});

export const p2State = playerState.clone({
  x: boardState.get().width - PADDLE_MARGIN,
  y: boardState.get().height / 2 - 64,
  width: 16,
  height: 128,
  moveDir: 0,
  score: 0
});

export const initGame = () => {
  loop$
    .pipe(
      tap(() => {
        ballState.tick();
        p1State.tick();
        p2State.tick();
      })
    )
    .subscribe();

  keyDown$
    .pipe(
      map((evt) => evt.which),
      map((keycode) => {
        const player = [38, 40].includes(keycode) ? p2State : p1State;

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

  windowResize$.subscribe(() => {
    boardState.set({
      width: window.innerWidth,
      height: window.innerHeight
    });

    p2State.merge({ x: boardState.get().width - PADDLE_MARGIN });
  });
};
