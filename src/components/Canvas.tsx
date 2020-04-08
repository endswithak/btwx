import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { store } from '../store';
import renderCanvas from '../canvas';

const Canvas = (): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globalState = useContext(store);
  const { selectedArtboard, selectedLayer, selectedLayerPath, sketchDocument, sketchPages, sketchImages, dispatch, paperApp, theme, layersSidebarWidth, stylesSidebarWidth, drawShape, drawShapeType } = globalState;

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
    .then((paperApp) => {
      dispatch({
        type: 'set-paper-app',
        paperApp: paperApp
      });
      console.log('done');
    });
  }, []);

  useEffect(() => {
    if (paperApp) {
      canvasRef.current.addEventListener('wheel', (e: WheelEvent) => {
        e.preventDefault();
        paperApp.onWheel(e);
      });
      window.addEventListener('resize', (e) => {
        paperApp.scope.view.viewSize.width = canvasContainerRef.current.clientWidth;
        paperApp.scope.view.viewSize.height = canvasContainerRef.current.clientHeight;
      });
    }
  }, [paperApp]);

  useEffect(() => {
    if (paperApp) {
      paperApp.scope.view.viewSize.width = canvasContainerRef.current.clientWidth;
      paperApp.scope.view.viewSize.height = canvasContainerRef.current.clientHeight;
    }
  }, [layersSidebarWidth, stylesSidebarWidth]);

  useEffect(() => {
    if (paperApp) {
      if (drawShape) {
        paperApp.enableDrawTool(drawShapeType);
      } else {
        paperApp.disableDrawTool();
      }
    }
  }, [drawShape]);

  return (
    <div
      className={`c-canvas ${drawShape ? 'c-canvas--drawing' : ''}`}
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