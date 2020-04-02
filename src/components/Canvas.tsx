import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { store } from '../store';
import renderCanvas from '../canvas';

const Canvas = (): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globalState = useContext(store);
  const { selectedPage, selectedPageArtboards, selectedArtboard, selectedLayer, selectedLayerPath, sketchDocument, sketchPages, sketchImages, dispatch, canvas, theme, layersSidebarWidth, stylesSidebarWidth } = globalState;

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    renderCanvas({
      sketchDocument: sketchDocument,
      sketchPages: sketchPages,
      sketchImages: sketchImages,
      selectedPage: selectedPage,
      selectedPageArtboards: selectedPageArtboards,
      selectedArtboard: selectedArtboard,
      dispatch: dispatch,
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
      window.addEventListener('resize', (e) => {
        canvas.viewSize.width = canvasContainerRef.current.clientWidth;
        canvas.viewSize.height = canvasContainerRef.current.clientHeight;
      });
    }
  }, [canvas]);

  useEffect(() => {
    if (canvas) {
      canvas.viewSize.width = canvasContainerRef.current.clientWidth;
      canvas.viewSize.height = canvasContainerRef.current.clientHeight;
    }
  }, [layersSidebarWidth, stylesSidebarWidth]);

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
    <div
      className='c-canvas'
      ref={canvasContainerRef}>
      <canvas
        id='canvas-main'
        ref={canvasRef}
        style={{
          background: theme.background.z0
        }} />
    </div>
  );
}

export default Canvas;