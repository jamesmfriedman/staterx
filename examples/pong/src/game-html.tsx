import React from 'react';
import { useRx } from 'staterx';
import { ball, p1, p2 } from './state';

function Game() {
  return (
    <div className="board">
      <Score />
      <Paddle state={p1} />
      <Paddle state={p2} />
      <Ball />
    </div>
  );
}

function Paddle({ state }: { state: typeof p1 | typeof p2 }) {
  const player = useRx(state.state$);

  return (
    <div
      className="paddle"
      style={{ transform: `translate(${player.x}px, ${player.y}px)` }}
    />
  );
}

function Ball() {
  const ballState = useRx(ball.state$);

  return (
    <div
      className="ball"
      style={{ transform: `translate(${ballState.x}px, ${ballState.y}px)` }}
    />
  );
}

function Score() {
  const p1State = useRx(p1.score$);
  const p2State = useRx(p2.score$);

  return (
    <div className="scores">
      <div className="score">{p1State}</div>
      <div className="score">{p2State}</div>
    </div>
  );
}

export default Game;
