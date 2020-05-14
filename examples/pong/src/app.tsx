import React, { useEffect, useState } from 'react';
import CanvasGame from './game-canvas';
import HTMLGame from './game-html';
import { initGame } from './state';

function App() {
  const [renderer, setRenderer] = useState<'html' | 'canvas'>('html');

  useEffect(() => {
    initGame();
  }, []);
  return (
    <>
      <button
        style={{ zIndex: 9, position: 'absolute' }}
        onClick={() => setRenderer(renderer === 'canvas' ? 'html' : 'canvas')}
      >
        Toggle
      </button>
      {renderer === 'canvas' ? <CanvasGame /> : <HTMLGame />}
    </>
  );
}

export default App;
