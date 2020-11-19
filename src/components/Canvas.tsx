/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect, useState, useRef, useCallback } from 'react';
import throttle from 'lodash.throttle';
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

interface CanvasProps {
  ready: boolean;
  documentImages?: {
    [id: string]: Btwx.DocumentImage;
  };
  paperProject?: string;
  matrix?: number[];
  interactionDisabled?: boolean;
  setReady(ready: boolean): void;
}

const Canvas = (props: CanvasProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const ref = useRef<HTMLCanvasElement>(null);
  const { ready, matrix, documentImages, paperProject, setReady, interactionDisabled } = props;
  const [layerEvent, setLayerEvent] = useState(null);
  const [uiEvent, setUIEvent] = useState(null);
  const [translateEvent, setTranslateEvent] = useState(null);
  const [zoomEvent, setZoomEvent] = useState(null);

  const handleHitResult = (e: any, eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu'): void => {
    const point = paperMain.view.getEventPoint(e);
    const layersHitResult = getPaperLayer('page').hitTest(point);
    const uiHitResult = getPaperLayer('ui').hitTest(point);
    const validHitResult = (hitResult: paper.HitResult): boolean => hitResult && hitResult.item && hitResult.item.data && hitResult.item.data.type;
    if (validHitResult(uiHitResult)) {
      setUIEvent({hitResult: uiHitResult, eventType: eventType, event: e.nativeEvent, empty: false});
    } else {
      if (validHitResult(layersHitResult)) {
        setLayerEvent({hitResult: layersHitResult, eventType: eventType, event: e.nativeEvent, empty: false});
      } else {
        setUIEvent({hitResult: uiHitResult, eventType: eventType, event: e.nativeEvent, empty: true});
        setLayerEvent({hitResult: layersHitResult, eventType: eventType, event: e.nativeEvent, empty: true});
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
    paperMain.setup(ref.current);
    importPaperProject({
      paperProject,
      documentImages
    });
    paperMain.view.viewSize = new paperMain.Size(ref.current.clientWidth, ref.current.clientHeight);
    paperMain.view.matrix.set(matrix);
    setReady(true);
  }, []);

  return (
    <div
      id='canvas-container'
      className='c-canvas'>
      <canvas
        id='canvas'
        ref={ref}
        onWheel={ready ? handleWheel : null}
        onMouseMove={ready && !interactionDisabled ? handleMouseMove : null}
        onMouseDown={ready && !interactionDisabled ? handleMouseDown : null}
        onMouseUp={ready && !interactionDisabled ? handleMouseUp : null}
        onDoubleClick={ready && !interactionDisabled ? handleDoubleClick : null}
        onContextMenu={ready && !interactionDisabled ? handleContextMenu : null}
        tabIndex={0}
        style={{
          background: theme.background.z0
        }} />
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
            <ResizeTool />
            <AreaSelectTool />
            <LineTool />
            <TextTool />
            <CanvasToast />
          </>
        : null
      }
    </div>
  );
}

const mapStateToProps = (state: RootState): {
  documentImages: {
    [id: string]: Btwx.DocumentImage;
  };
  paperProject: string;
  matrix: number[];
  interactionDisabled: boolean;
} => {
  const { layer, documentSettings, canvasSettings } = state;
  return {
    documentImages: documentSettings.images.byId,
    paperProject: layer.present.paperProject,
    matrix: documentSettings.matrix,
    interactionDisabled: canvasSettings.selecting || canvasSettings.resizing || canvasSettings.drawing || canvasSettings.zooming || canvasSettings.translating || canvasSettings.dragging
  };
};

export default connect(
  mapStateToProps
)(Canvas);