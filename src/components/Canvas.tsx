import React, { useRef, useContext, useEffect } from 'react';
import { store } from '../store';
import paper from 'paper';

const Canvas = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const globalState = useContext(store);
  const { sketchDocument } = globalState;

  useEffect(() => {
    canvas.current.width = window.innerWidth;
    canvas.current.height = window.innerHeight;
    paper.setup(canvas.current);
    console.log(sketchDocument);
  }, []);

  return (
    <canvas
      id='c-canvas'
      ref={canvas} />
  );
}

export default Canvas;