import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { store } from '../store';
import renderCanvas from '../canvas';

const Canvas = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globalState = useContext(store);
  const { selectedPage, selectedPageArtboards, selectedArtboard, selectedLayer, selectedLayerPath, sketchDocument, sketchPages, sketchImages, dispatch, canvas, theme } = globalState;

  const onResize = (): void => {
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    renderCanvas({
      sketchDocument: sketchDocument,
      sketchPages: sketchPages,
      sketchImages: sketchImages,
      selectedPage: selectedPage,
      selectedPageArtboards: selectedPageArtboards,
      selectedArtboard: selectedArtboard,
      canvas: canvasRef.current
    })
    .then((paperView) => {
      dispatch({
        type: 'set-canvas',
        canvas: paperView
      });
      console.log('done');
    });
  }, []);

  useEffect(() => {
    if (canvas) {
      canvasRef.current.addEventListener('wheel', (e: WheelEvent) => {
        e.preventDefault();
        canvas.emit('wheel', e);
      });
    }
  }, [canvas]);

  useEffect(() => {
    if (canvas) {
      canvas.emit('selected-layer-update', {
        artboard: selectedArtboard.do_objectID,
        layer: selectedLayer.do_objectID,
        path: selectedLayerPath
      });
    }
  }, [selectedLayer]);

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