import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { store } from '../store';
import renderCanvas from '../canvas';

const Canvas = (): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globalState = useContext(store);
  const { drawing, dispatch, paperApp, theme, layersSidebarWidth, stylesSidebarWidth } = globalState;

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    paper.setup(canvasRef.current);
    // renderCanvas({
    //   dispatch: dispatch,
    //   canvas: canvasRef.current
    // });
  }, []);

  // useEffect(() => {
  //   if (paperApp) {
  //     canvasRef.current.addEventListener('wheel', (e: WheelEvent) => {
  //       e.preventDefault();
  //       paperApp.onWheel(e);
  //     });
  //     window.addEventListener('resize', (e) => {
  //       paperApp.scope.view.viewSize.width = canvasContainerRef.current.clientWidth;
  //       paperApp.scope.view.viewSize.height = canvasContainerRef.current.clientHeight;
  //     });
  //   }
  // }, [paperApp]);

  // useEffect(() => {
  //   if (paperApp) {
  //     paperApp.scope.view.viewSize.width = canvasContainerRef.current.clientWidth;
  //     paperApp.scope.view.viewSize.height = canvasContainerRef.current.clientHeight;
  //   }
  // }, [layersSidebarWidth, stylesSidebarWidth]);

  return (
    <div
      className={`c-canvas ${drawing ? 'c-canvas--drawing' : ''}`}
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