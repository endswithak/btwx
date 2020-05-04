import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { addPage } from '../store/actions/layer';
import { enableSelectionTool } from '../store/actions/tool';
import { ThemeContext } from './ThemeProvider';
import { AddPagePayload, LayerTypes } from '../store/actionTypes/layer';
//import renderCanvas from '../canvas';

interface CanvasProps {
  addPage(payload: AddPagePayload): LayerTypes;
  enableSelectionTool(): any;
}

const Canvas = ({addPage, enableSelectionTool}: CanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  //const { drawing, dispatch, theme, layersSidebarWidth, stylesSidebarWidth } = globalState;

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    paper.setup(canvasRef.current);
    addPage({
      name: 'Page 1'
    });
    enableSelectionTool();
    canvasRef.current.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) {
        e.preventDefault();
        const nextZoom = paper.view.zoom - e.deltaY * 0.01;
        // paper.view.center.x = e.clientX;
        // paper.view.center.y = e.clientY;
        if (e.deltaY < 0 && nextZoom < 30) {
          paper.view.zoom = nextZoom;
        } else if (e.deltaY > 0 && nextZoom > 0) {
          paper.view.zoom = nextZoom;
        } else if (e.deltaY > 0 && nextZoom < 0) {
          paper.view.zoom = 0.001;
        }
      } else {
        paper.view.translate(new paper.Point(e.deltaX * -1, e.deltaY * -1));
      }
    });
  }, []);

  // useEffect(() => {
  //   if (paperApp) {
  //     paperApp.scope.view.viewSize.width = canvasContainerRef.current.clientWidth;
  //     paperApp.scope.view.viewSize.height = canvasContainerRef.current.clientHeight;
  //   }
  // }, [layersSidebarWidth, stylesSidebarWidth]);

  return (
    <div
      className={`c-canvas`}
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

export default connect(
  null,
  { addPage, enableSelectionTool }
)(Canvas);