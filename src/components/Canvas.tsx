/* eslint-disable @typescript-eslint/no-use-before-define */
import paper from 'paper';
import React, { useContext, ReactElement, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { importPaperProject, getPaperLayer } from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
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
import CanvasPage from './CanvasPage';
import CanvasUI from './CanvasUI';
import CanvasArtboards from './CanvasArtboards';

interface CanvasProps {
  ready: boolean;
  interactionEnabled?: boolean;
  setReady(ready: boolean): void;
}

const Canvas = (props: CanvasProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const ref = useRef<HTMLDivElement>(null);
  const { ready, setReady, interactionEnabled } = props;
  const [layerEvent, setLayerEvent] = useState(null);
  const [uiEvent, setUIEvent] = useState(null);
  const [translateEvent, setTranslateEvent] = useState(null);
  const [zoomEvent, setZoomEvent] = useState(null);

  const handleHitResult = (e: any, eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu'): void => {
    const { layerHitResult, uiHitResult } = paperMain.projects.reduce((result, current, index) => {
      const hitResult = current.hitTest(current.view.getEventPoint(e));
      if (hitResult) {
        if (index === 1) {
          result.uiHitResult = hitResult;
        } else {
          result.layerHitResult = hitResult
        }
      }
      return result;
    }, { layerHitResult: null, uiHitResult: null });
    const validHitResult = (hitResult: paper.HitResult): boolean => hitResult && hitResult.item && hitResult.item.data && hitResult.item.data.type;
    if (validHitResult(uiHitResult)) {
      setUIEvent({hitResult: uiHitResult, eventType: eventType, event: e.nativeEvent, empty: false});
    } else {
      if (validHitResult(layerHitResult)) {
        setLayerEvent({hitResult: layerHitResult, eventType: eventType, event: e.nativeEvent, empty: false});
      } else {
        setUIEvent({hitResult: uiHitResult, eventType: eventType, event: e.nativeEvent, empty: true});
        setLayerEvent({hitResult: layerHitResult, eventType: eventType, event: e.nativeEvent, empty: true});
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

  useEffect(() => {
    console.log('CANVAS');
    setReady(true);
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
        background: theme.background.z0
      }}>
      <CanvasPage />
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
            {/* <ResizeTool />
            <AreaSelectTool />
            <LineTool />
            <TextTool />
            <CanvasToast /> */}
          </>
        : null
      }
    </div>
  );
}

const mapStateToProps = (state: RootState): {
  interactionEnabled: boolean;
} => {
  const { canvasSettings } = state;
  return {
    interactionEnabled: !canvasSettings.selecting && !canvasSettings.resizing && !canvasSettings.drawing && !canvasSettings.zooming && !canvasSettings.translating && !canvasSettings.dragging
  };
};

export default connect(
  mapStateToProps
)(Canvas);