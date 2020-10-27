// import { remote } from 'electron';
import React, { useRef, useContext, ReactElement, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import { paperMain } from '../canvas';
import CanvasInteractionsLayer from './CanvasLayers';
import CanvasInteractionsUI from './CanvasUI';
import DragTool from './DragTool';
import ShapeTool from './ShapeTool';

interface CanvasInteractionWrapProps {
  ready: boolean;
  children: ReactElement | ReactElement[];
}

const CanvasInteractionWrap = (props: CanvasInteractionWrapProps): ReactElement => {
  const canvasInteractionContainerRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { ready, children } = props;
  const [layerHitResult, setLayerHitResult] = useState(null);
  const [uiHitResult, setUIHitResult] = useState(null);

  const handleHitResult = (e: any, eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu'): void => {
    const point = paperMain.view.getEventPoint(e);
    const hitResult = paperMain.project.hitTest(point);
    const validHitResult = hitResult && hitResult.item && hitResult.item.data && hitResult.item.data.type;
    if (validHitResult) {
      if (hitResult.item.data.type === 'Layer' || hitResult.item.data.type === 'LayerChild') {
        setLayerHitResult({hitResult, eventType, event: e.nativeEvent, empty: false});
      }
      if (hitResult.item.data.type === 'UIElement' || hitResult.item.data.type === 'UIElementChild') {
        setUIHitResult({hitResult, eventType, event: e.nativeEvent, empty: false});
      }
    } else {
      setLayerHitResult({hitResult, eventType, event: e.nativeEvent, empty: true});
      setUIHitResult({hitResult, eventType, event: e.nativeEvent, empty: true});
    }
  }

  const handleMouseMove = (e: any): void => {
    handleHitResult(e, 'mouseMove');
  }

  const handleMouseDown = (e: any): void => {
    handleHitResult(e, 'mouseDown');
  }

  const handleMouseUp = (e: any): void => {
    handleHitResult(e, 'mouseUp');
  }

  const handleDoubleClick = (e: any): void => {
    handleHitResult(e, 'doubleClick');
  }

  const handleContextMenu = (e: any): void => {
    handleHitResult(e, 'contextMenu');
  }

  return (
    <div
      id='canvas-interaction-container'
      ref={canvasInteractionContainerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}>
      <CanvasInteractionsLayer
        hitResult={layerHitResult} />
      {/* <DragTool
        hitResult={layerHitResult} /> */}
      {
        ready
        ? <ShapeTool />
        : null
      }
      {/* <CanvasInteractionsUI
        hitResult={uiHitResult} /> */}
      {
        children
      }
    </div>
  );
}

export default CanvasInteractionWrap;