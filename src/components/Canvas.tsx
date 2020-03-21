import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { store } from '../store';
import renderCanvas from '../canvas';

const Canvas = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globalState = useContext(store);
  const { sketchPages, dispatch, canvas, theme } = globalState;

  const onResize = (): void => {
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    renderCanvas({
      sketchPages: sketchPages,
      canvas: canvasRef.current
    })
    .then(() => {
      console.log('done');
    });
  }, []);

  return (
    <canvas
      id='c-canvas'
      ref={canvasRef}
      style={{
        background: theme.background.z0
      }} />
  );
}

export default Canvas;