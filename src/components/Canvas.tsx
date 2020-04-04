import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { store } from '../store';
import renderCanvas from '../canvas';

const Canvas = (): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globalState = useContext(store);
  const { selectedArtboard, selectedLayer, selectedLayerPath, sketchDocument, sketchPages, sketchImages, dispatch, project, theme, layersSidebarWidth, stylesSidebarWidth } = globalState;

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    renderCanvas({
      sketchDocument: sketchDocument,
      sketchPages: sketchPages,
      sketchImages: sketchImages,
      dispatch: dispatch,
      canvas: canvasRef.current
    })
    .then((paperProject) => {
      dispatch({
        type: 'set-project',
        project: paperProject
      });
      console.log('done');
    });
  }, []);

  useEffect(() => {
    if (project) {
      canvasRef.current.addEventListener('wheel', (e: WheelEvent) => {
        e.preventDefault();
        project.view.emit('wheel', e);
      });
      window.addEventListener('resize', (e) => {
        project.view.viewSize.width = canvasContainerRef.current.clientWidth;
        project.view.viewSize.height = canvasContainerRef.current.clientHeight;
      });
    }
  }, [project]);

  useEffect(() => {
    if (project) {
      project.view.viewSize.width = canvasContainerRef.current.clientWidth;
      project.view.viewSize.height = canvasContainerRef.current.clientHeight;
    }
  }, [layersSidebarWidth, stylesSidebarWidth]);

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