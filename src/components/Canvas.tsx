import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { addPage } from '../store/actions/layer';
import { enableSelectionTool } from '../store/actions/selectionTool';
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
    // dispatch({
    //   type: 'add-page'
    // });
    // dispatch({
    //   type: 'add-draw-tool',
    //   dispatch: dispatch
    // });
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