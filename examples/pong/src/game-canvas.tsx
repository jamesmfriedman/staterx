import React, { useEffect, useRef } from 'react';
import { useRx } from 'staterx';
import { ball, p1, p2, board } from './state';

function Game() {
  return (
    <div className="board">
      <Score />
      <Canvas />
    </div>
  );
}

function Canvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;

    const reset = () => {
      const boardState = board.get();
      canvas.width = boardState.width;
      canvas.height = boardState.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'greenyellow';
    };

    const drawBall = () => {
      const { x, y, width } = ball.get();
      const half = width / 2;
      var centerX = x + half;
      var centerY = y + half;
      var radius = half;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      ctx.fill();
    };

    const drawPlayer = (p: typeof p1 | typeof p2) => {
      const { x, y, width, height } = p.get();
      ctx.fillRect(x, y, width, height);
    };

    ball.state$.subscribe(() => {
      reset();
      drawBall();
      drawPlayer(p1);
      drawPlayer(p2);
    });
  }, []);

  return <canvas className="canvas" ref={ref} />;
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
