/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { RootState } from '../store/reducers';
import { enableZoomToolThunk, disableZoomToolThunk } from '../store/actions/zoomTool';
import { enableTranslateToolThunk, disableTranslateToolThunk } from '../store/actions/translateTool';
import { CanvasSettingsTypes, SetCanvasMousePositionPayload } from '../store/actionTypes/canvasSettings';
import { setCanvasMousePosition } from '../store/actions/canvasSettings';
import { paperMain } from '../canvas';
import { ThemeContext } from './ThemeProvider';

interface CanvasProps {
  ready: boolean;
  cursor?: string;
  zooming?: boolean;
  zoomType?: em.ZoomType;
  translating?: boolean;
  setCanvasMousePosition?(payload: SetCanvasMousePositionPayload): CanvasSettingsTypes;
  enableZoomToolThunk?(zoomType: em.ZoomType): void;
  disableZoomToolThunk?(): void;
  enableTranslateToolThunk?(): void;
  disableTranslateToolThunk?(): void;
}

const Canvas = (props: CanvasProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { disableZoomToolThunk, disableTranslateToolThunk, enableTranslateToolThunk, translating, ready, enableZoomToolThunk, cursor, zooming, zoomType } = props;

  // const debounceZoom = useCallback(
  //   debounce(() => {
  //     disableZoomToolThunk();
  //   }, 100),
  //   []
  // );

  // const debounceTranslate = useCallback(
  //   debounce(() => {
  //     disableTranslateToolThunk();
  //   }, 100),
  //   []
  // );

  useEffect(() => {
    console.log('CANVAS');
  }, []);

  const handleWheel = (e: any): void => {
    if (e.ctrlKey) {
      // if (!zooming) {
      //   enableZoomToolThunk(e.deltaY < 0 ? 'in' : 'out');
      // }
      // debounceZoom();
      const cursorPoint = paperMain.view.getEventPoint(e as any);
      const pointDiff = new paperMain.Point(cursorPoint.x - paperMain.view.center.x, cursorPoint.y - paperMain.view.center.y);
      const prevZoom = paperMain.view.zoom;
      const nextZoom = paperMain.view.zoom - e.deltaY * 0.01;
      if (e.deltaY < 0 && nextZoom < 30) {
        // if (zoomType !== 'in') {
        //   enableZoomToolThunk('in');
        // }
        paperMain.view.zoom = nextZoom;
      } else if (e.deltaY > 0 && nextZoom > 0) {
        // if (zoomType !== 'out') {
        //   enableZoomToolThunk('out');
        // }
        paperMain.view.zoom = nextZoom;
      } else if (e.deltaY > 0 && nextZoom < 0) {
        paperMain.view.zoom = 0.01;
      }
      const zoomDiff = paperMain.view.zoom - prevZoom;
      paperMain.view.translate(
        new paperMain.Point(
          ((zoomDiff * pointDiff.x) * ( 1 / paperMain.view.zoom)) * -1,
          ((zoomDiff * pointDiff.y) * ( 1 / paperMain.view.zoom)) * -1
        )
      );
    } else {
      // if (!translating) {
      //   enableTranslateToolThunk();
      // }
      // debounceTranslate();
      paperMain.view.translate(
        new paperMain.Point(
          (e.deltaX * ( 1 / paperMain.view.zoom)) * -1,
          (e.deltaY * ( 1 / paperMain.view.zoom)) * -1
        )
      );
    }
  }

  return (
    <canvas
      id='canvas'
      onWheel={ready ? handleWheel : null}
      tabIndex={0}
      style={{
        background: theme.background.z0,
        cursor: cursor
      }} />
  );
}

export default Canvas;

// const mapStateToProps = (state: RootState): {
//   cursor: string;
//   zooming: boolean;
//   zoomType: em.ZoomType;
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