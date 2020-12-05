/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getAllPaperScopes } from '../store/selectors/layer';
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
import CanvasPage from './CanvasPage';
import CanvasArtboards from './CanvasArtboards';
import { uiPaperScope } from '../canvas';

interface CanvasProps {
  ready: boolean;
  interactionEnabled?: boolean;
  paperScopes?: string[];
  setReady(ready: boolean): void;
}

const Canvas = (props: CanvasProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const ref = useRef<HTMLDivElement>(null);
  const { ready, setReady, interactionEnabled, paperScopes } = props;
  const [layerEvent, setLayerEvent] = useState(null);
  const [uiEvent, setUIEvent] = useState(null);
  const [translateEvent, setTranslateEvent] = useState(null);
  const [zoomEvent, setZoomEvent] = useState(null);

  const handleHitResult = (e: any, eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu'): void => {
    const { layerHitResult, uiHitResult } = paperScopes.reduce((result: { layerHitResult: { hitResult: paper.HitResult; paperScope: number }; uiHitResult: paper.HitResult }, current, index) => {
      const paperScope = uiPaperScope.projects[index];
      if (paperScope) {
        const hitResult = paperScope.hitTest(paperScope.view.getEventPoint(e));
        if (hitResult) {
          if (current === 'ui') {
            result.uiHitResult = hitResult;
          } else {
            result.layerHitResult = {
              hitResult,
              paperScope: index
            };
          }
        }
      }
      return result;
    }, { layerHitResult: { hitResult: null, paperScope: null }, uiHitResult: null });
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
          paperScope: layerHitResult.paperScope,
          eventType: eventType,
          event: e.nativeEvent,
          empty: false
        });
      } else {
        setUIEvent({
          hitResult: uiHitResult,
          eventType: eventType,
          event: e.nativeEvent,
          empty: true
        });
        setLayerEvent({
          hitResult: layerHitResult,
          paperScope: null,
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
    paperScopes.forEach((key, index) => {
      const paperScope = uiPaperScope.projects[index];
      paperScope.view.viewSize = new uiPaperScope.Size(ref.current.clientWidth, ref.current.clientHeight);
    });
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    console.log('CANVAS');
    setReady(true);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
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
      {/* <CanvasPage /> */}
      <CanvasUI />
      {
        ready
        ? <>
            <CanvasArtboards />
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

const mapStateToProps = (state: RootState): {
  interactionEnabled: boolean;
  paperScopes: string[];
} => {
  const { canvasSettings, layer } = state;
  return {
    interactionEnabled: !canvasSettings.selecting && !canvasSettings.resizing && !canvasSettings.drawing && !canvasSettings.zooming && !canvasSettings.translating && !canvasSettings.dragging,
    paperScopes: ['ui', ...layer.present.childrenById.root]
  };
};

export default connect(
  mapStateToProps
)(Canvas);