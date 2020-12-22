/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import { setCanvasReady } from '../store/actions/canvasSettings';
import { getAllProjectIndices } from '../store/selectors/layer';
import { ThemeContext } from './ThemeProvider';
import CanvasLayerEvents from './CanvasLayerEvents';
import CanvasUIEvents from './CanvasUIEvents';
import CanvasToast from './CanvasToast';
import ZoomTool from './ZoomTool';
import TranslateTool from './TranslateTool';
import DragTool from './DragTool';
import ResizeTool from './ResizeTool';
import ShapeTool from './ShapeTool';
import ArtboardTool from './ArtboardTool';
import AreaSelectTool from './AreaSelectTool';
import LineTool from './LineTool';
import TextTool from './TextTool';
import GradientTool from './GradientTool';
import CanvasUI from './CanvasUI';
import CanvasArtboards from './CanvasArtboards';

const Canvas = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const ref = useRef<HTMLDivElement>(null);
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);
  const interactionEnabled = useSelector((state: RootState) => !state.canvasSettings.selecting && !state.canvasSettings.resizing && !state.canvasSettings.drawing && !state.canvasSettings.zooming && !state.canvasSettings.translating && !state.canvasSettings.dragging);
  const allProjectIndices = useSelector((state: RootState) => getAllProjectIndices(state));
  const cursor = useSelector((state: RootState) => state.canvasSettings.cursor);
  const [layerEvent, setLayerEvent] = useState(null);
  const [uiEvent, setUIEvent] = useState(null);
  const [translateEvent, setTranslateEvent] = useState(null);
  const [zoomEvent, setZoomEvent] = useState(null);
  const dispatch = useDispatch();

  const handleHitResult = (e: any, eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu'): void => {
    const { layerHitResult, uiHitResult } = allProjectIndices.reduce((result: { layerHitResult: { hitResult: paper.HitResult; projectIndex: number }; uiHitResult: paper.HitResult }, current, index) => {
      const project = uiPaperScope.projects[current];
      if (project) {
        const hitResult = project.hitTest(project.view.getEventPoint(e));
        if (hitResult) {
          if (current === 0) {
            result.uiHitResult = hitResult;
          } else {
            result.layerHitResult = {
              hitResult,
              projectIndex: index
            };
          }
        }
      }
      return result;
    }, { layerHitResult: { hitResult: null, projectIndex: null }, uiHitResult: null });
    const validHitResult = (hitResult: paper.HitResult): boolean => hitResult && hitResult.item && hitResult.item.data && hitResult.item.data.type;
    if (validHitResult(uiHitResult)) {
      setUIEvent({
        hitResult: uiHitResult,
        eventType: eventType,
        event: e.nativeEvent,
        empty: false
      });
    } else {
      if (validHitResult(layerHitResult.hitResult)) {
        setLayerEvent({
          hitResult: layerHitResult.hitResult,
          projectIndex: layerHitResult.projectIndex,
          eventType: eventType,
          event: e.nativeEvent,
          empty: false
        });
      } else {
        setUIEvent({
          hitResult: null,
          eventType: eventType,
          event: e.nativeEvent,
          empty: true
        });
        setLayerEvent({
          hitResult: null,
          projectIndex: null,
          eventType: eventType,
          event: e.nativeEvent,
          empty: true
        });
      }
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

  const handleWheel = (e: any): void => {
    if (e.ctrlKey) {
      setZoomEvent(e.nativeEvent);
    } else {
      setTranslateEvent(e.nativeEvent);
    }
  }

  const handleResize = (): void => {
    allProjectIndices.forEach((current, index) => {
      const project = uiPaperScope.projects[current];
      project.view.viewSize = new uiPaperScope.Size(ref.current.clientWidth, ref.current.clientHeight);
    });
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return (): void => {
      window.removeEventListener('resize', handleResize);
    }
  }, [allProjectIndices]);

  useEffect(() => {
    console.log('CANVAS');
    dispatch(setCanvasReady());
  }, []);

  return (
    <div
      id='canvas-container'
      className='c-canvas'
      ref={ref}
      onMouseMove={ready && interactionEnabled ? handleMouseMove : null}
      onMouseDown={ready ? handleMouseDown : null}
      onMouseUp={ready ? handleMouseUp : null}
      onDoubleClick={ready ? handleDoubleClick : null}
      onContextMenu={ready ? handleContextMenu : null}
      onWheel={ready ? handleWheel : null}
      style={{
        background: theme.background.z0,
        cursor: cursor[0]
      }}>
      <CanvasUI />
      <CanvasArtboards />
      {
        ready
        ? <>
            <CanvasLayerEvents
              layerEvent={layerEvent} />
            <CanvasUIEvents
              uiEvent={uiEvent} />
            <ZoomTool
              zoomEvent={zoomEvent} />
            <TranslateTool
              translateEvent={translateEvent} />
            <ArtboardTool />
            <ShapeTool />
            <DragTool />
            <AreaSelectTool />
            <ResizeTool />
            <LineTool />
            <TextTool />
            <GradientTool />
            <CanvasToast />
          </>
        : null
      }
    </div>
  );
}

export default Canvas;