import React, { useEffect } from 'react';
import { useRx } from 'staterx';
import { ballState, initGame, p1State, p2State } from './state';

function Game() {
  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className="board">
      <Score />
      <Paddle state={p1State} />
      <Paddle state={p2State} />
      <Ball />
    </div>
  );
}

function Paddle({ state }: { state: typeof p1State | typeof p2State }) {
  const [player] = useRx(state.state$);

  return (
    <div
      className="paddle"
      style={{ transform: `translate(${player.x}px, ${player.y}px)` }}
    />
  );
}

function Ball() {
  const [ball] = useRx(ballState.state$);

  return (
    <div
      className="ball"
      style={{ transform: `translate(${ball.x}px, ${ball.y}px)` }}
    />
  );
}

function Score() {
  const [p1] = useRx(p1State.score$);
  const [p2] = useRx(p2State.score$);

  return (
    <div className="scores">
      <div className="score">{p1}</div>
      <div className="score">{p2}</div>
    </div>
  );
}

export default Game;
