/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { importPaperProject } from '../store/selectors/layer';
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

interface CanvasProps {
  ready: boolean;
  documentImages?: {
    [id: string]: Btwx.DocumentImage;
  };
  paperProject?: string;
  matrix?: number[];
  setReady(ready: boolean): void;
}

const Canvas = (props: CanvasProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const ref = useRef<HTMLCanvasElement>(null);
  const { ready, matrix, documentImages, paperProject, setReady } = props;
  const [layerEvent, setLayerEvent] = useState(null);
  const [uiEvent, setUIEvent] = useState(null);
  const [translateEvent, setTranslateEvent] = useState(null);
  const [zoomEvent, setZoomEvent] = useState(null);

  const handleHitResult = (e: any, eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu'): void => {
    const point = paperMain.view.getEventPoint(e);
    const hitResult = paperMain.project.hitTest(point);
    const validHitResult = hitResult && hitResult.item && hitResult.item.data && hitResult.item.data.type;
    if (validHitResult) {
      if (hitResult.item.data.type === 'Layer' || hitResult.item.data.type === 'LayerChild') {
        setLayerEvent({hitResult, eventType, event: e.nativeEvent, empty: false});
      }
      if (hitResult.item.data.type === 'UIElement' || hitResult.item.data.type === 'UIElementChild') {
        setUIEvent({hitResult, eventType, event: e.nativeEvent, empty: false});
      }
    } else {
      setLayerEvent({hitResult, eventType, event: e.nativeEvent, empty: true});
      setUIEvent({hitResult, eventType, event: e.nativeEvent, empty: true});
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
        onMouseMove={ready ? handleMouseMove : null}
        onMouseDown={ready ? handleMouseDown : null}
        onMouseUp={ready ? handleMouseUp : null}
        onDoubleClick={ready ? handleDoubleClick : null}
        onContextMenu={ready ? handleContextMenu : null}
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
} => {
  const { layer, documentSettings } = state;
  return {
    documentImages: documentSettings.images.byId,
    paperProject: layer.present.paperProject,
    matrix: documentSettings.matrix
  };
};

export default connect(
  mapStateToProps
)(Canvas);

// const mapStateToProps = (state: RootState): {
//   activeTool: Btwx.ToolType;
// } => {
//   const { canvasSettings } = state;
//   const activeTool = canvasSettings.activeTool;
//   return { activeTool };
// };

// export default connect(
//   null,
//   { setCanvasActiveTool }
// )(Canvas);

// /* eslint-disable @typescript-eslint/no-use-before-define */
// import React, { useContext, ReactElement, useCallback, useEffect } from 'react';
// import { connect } from 'react-redux';
// import debounce from 'lodash.debounce';
// import { RootState } from '../store/reducers';
// import { enableZoomToolThunk, disableZoomToolThunk } from '../store/actions/zoomTool';
// import { enableTranslateToolThunk, disableTranslateToolThunk } from '../store/actions/translateTool';
// import { CanvasSettingsTypes, SetCanvasMousePositionPayload } from '../store/actionTypes/canvasSettings';
// import { setCanvasMousePosition } from '../store/actions/canvasSettings';
// import { paperMain } from '../canvas';
// import { ThemeContext } from './ThemeProvider';

// interface CanvasProps {
//   ready: boolean;
//   cursor?: string;
//   zooming?: boolean;
//   zoomType?: Btwx.ZoomType;
//   translating?: boolean;
//   setCanvasMousePosition?(payload: SetCanvasMousePositionPayload): CanvasSettingsTypes;
//   enableZoomToolThunk?(zoomType: Btwx.ZoomType): void;
//   disableZoomToolThunk?(): void;
//   enableTranslateToolThunk?(): void;
//   disableTranslateToolThunk?(): void;
// }

// const Canvas = (props: CanvasProps): ReactElement => {
//   const theme = useContext(ThemeContext);
//   const { disableZoomToolThunk, disableTranslateToolThunk, enableTranslateToolThunk, translating, ready, enableZoomToolThunk, cursor, zooming, zoomType } = props;

//   const debounceZoom = useCallback(
//     debounce(() => {
//       disableZoomToolThunk();
//     }, 100),
//     []
//   );

//   // const debounceTranslate = useCallback(
//   //   debounce(() => {
//   //     disableTranslateToolThunk();
//   //   }, 100),
//   //   []
//   // );

//   useEffect(() => {
//     console.log('CANVAS');
//   }, []);

//   const handleWheel = (e: any): void => {
//     if (e.ctrlKey) {
//       if (!zooming) {
//         enableZoomToolThunk(e.deltaY < 0 ? 'in' : 'out');
//       }
//       debounceZoom();
//       const cursorPoint = paperMain.view.getEventPoint(e as any);
//       const pointDiff = new paperMain.Point(cursorPoint.x - paperMain.view.center.x, cursorPoint.y - paperMain.view.center.y);
//       const prevZoom = paperMain.view.zoom;
//       const nextZoom = paperMain.view.zoom - e.deltaY * 0.01;
//       if (e.deltaY < 0 && nextZoom < 30) {
//         // if (zoomType !== 'in') {
//         //   enableZoomToolThunk('in');
//         // }
//         paperMain.view.zoom = nextZoom;
//       } else if (e.deltaY > 0 && nextZoom > 0) {
//         // if (zoomType !== 'out') {
//         //   enableZoomToolThunk('out');
//         // }
//         paperMain.view.zoom = nextZoom;
//       } else if (e.deltaY > 0 && nextZoom < 0) {
//         paperMain.view.zoom = 0.01;
//       }
//       const zoomDiff = paperMain.view.zoom - prevZoom;
//       paperMain.view.translate(
//         new paperMain.Point(
//           ((zoomDiff * pointDiff.x) * ( 1 / paperMain.view.zoom)) * -1,
//           ((zoomDiff * pointDiff.y) * ( 1 / paperMain.view.zoom)) * -1
//         )
//       );
//     } else {
//       // if (!translating) {
//       //   enableTranslateToolThunk();
//       // }
//       // debounceTranslate();
//       paperMain.view.translate(
//         new paperMain.Point(
//           (e.deltaX * ( 1 / paperMain.view.zoom)) * -1,
//           (e.deltaY * ( 1 / paperMain.view.zoom)) * -1
//         )
//       );
//     }
//   }

//   return (
//     <canvas
//       id='canvas'
//       onWheel={ready ? handleWheel : null}
//       tabIndex={0}
//       style={{
//         background: theme.background.z0,
//         cursor: cursor
//       }} />
//   );
// }

// // export default Canvas;

// const mapStateToProps = (state: RootState): {
//   cursor: string;
//   zooming: boolean;
//   zoomType: Btwx.ZoomType;
//   translating: boolean;
// } => {
//   const { canvasSettings } = state;
//   const activeTool = canvasSettings.activeTool;
//   const cursor = (() => {
//     switch(activeTool) {
//       case 'Shape':
//       case 'Artboard':
//         return 'crosshair';
//       case 'Text':
//         return 'text';
//       case 'Line':
//       case 'Resize': {
//         if (canvasSettings.resizeType) {
//           return `${canvasSettings.resizeType}-resize`;
//         }
//         return null;
//       }
//       case 'Zoom':
//         if (canvasSettings.zoomType) {
//           return `zoom-${canvasSettings.zoomType}`;
//         }
//         return null;
//     }
//   })();
//   return {
//     cursor,
//     zooming: canvasSettings.zooming,
//     zoomType: canvasSettings.zoomType,
//     translating: canvasSettings.translating
//   };
// };

// export default connect(
//   mapStateToProps,
//   { disableZoomToolThunk, disableTranslateToolThunk, enableTranslateToolThunk, setCanvasMousePosition, enableZoomToolThunk }
// )(Canvas);