/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useCallback } from 'react';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasCursor, setCanvasZooming } from '../store/actions/canvasSettings';
import { setCanvasMatrix } from '../store/actions/documentSettings';
import { getAllProjectIndices } from '../store/selectors/layer';

const WheelTool = (): ReactElement => {
  const cursor = useSelector((state: RootState) => state.canvasSettings.cursor);
  const allProjectIndices = useSelector((state: RootState) => getAllProjectIndices(state));
  const dispatch = useDispatch();

  const debounceTranslate = useCallback(
    debounce(() => {
      dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
    }, 100),
    []
  );

  const debounceZoomEnd = useCallback(
    debounce((currentCursor: Btwx.CanvasCursor[]) => {
      dispatch(setCanvasZooming({zooming: false}));
      dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
      dispatch(setCanvasCursor({cursor: currentCursor.filter(c => c !== 'zoom-in' && c !== 'zoom-out')}));
    }, 50),
    []
  );

  const handleWheel = throttle((e) => {
    if (e.ctrlKey) {
      dispatch(setCanvasZooming({zooming: true}));
      const cursorPoint = paperMain.project.view.getEventPoint(e as any);
      const pointDiff = new paperMain.Point(cursorPoint.x - paperMain.view.center.x, cursorPoint.y - paperMain.view.center.y);
      allProjectIndices.forEach((current, index) => {
        const project = paperMain.projects[current];
        if (index === 0) {
          const prevZoom = project.view.zoom;
          const nextZoom = project.view.zoom - e.deltaY * (0.01 * project.view.zoom);
          if (e.deltaY < 0 && nextZoom < 25) {
            if (cursor[0] !== 'zoom-in') {
              dispatch(setCanvasCursor({cursor: ['zoom-in', ...cursor]}));
            }
            project.view.zoom = nextZoom;
          } else if (e.deltaY > 0 && nextZoom > 0) {
            if (cursor[0] !== 'zoom-out') {
              dispatch(setCanvasCursor({cursor: ['zoom-out', ...cursor]}));
            }
            project.view.zoom = nextZoom;
          } else if (e.deltaY > 0 && nextZoom < 0) {
            project.view.zoom = 0.01;
          }
          const zoomDiff = project.view.zoom - prevZoom;
          project.view.translate(
            new paperMain.Point(
              ((zoomDiff * pointDiff.x) * (1 / project.view.zoom)) * -1,
              ((zoomDiff * pointDiff.y) * (1 / project.view.zoom)) * -1
            )
          );
        } else {
          project.view.matrix = paperMain.projects[0].view.matrix;
        }
      });
      debounceZoomEnd(cursor);
    } else {
      allProjectIndices.forEach((current, index) => {
        const project = paperMain.projects[current];
        if (index === 0) {
          project.view.translate(
            new paperMain.Point(
              (e.deltaX * ( 1 / project.view.zoom)) * -1,
              (e.deltaY * ( 1 / project.view.zoom)) * -1
            )
          )
        } else {
          project.view.matrix = paperMain.projects[0].view.matrix;
        }
      });
      debounceTranslate();
    }
  }, 25);

  useEffect(() => {
    const canvas = document.getElementById('canvas-container');
    canvas.addEventListener('wheel', handleWheel);
    return () => {
      document.removeEventListener('wheel', handleWheel);
    }
  }, [allProjectIndices]);

  return (
    <></>
  );
}

export default WheelTool;