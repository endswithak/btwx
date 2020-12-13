/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import { getAllProjectIndices } from '../store/selectors/layer';
import { setCanvasZooming } from '../store/actions/canvasSettings';
import { setCanvasMatrix } from '../store/actions/documentSettings';

interface ZoomToolProps {
  zoomEvent: WheelEvent;
}

const ZoomTool = (props: ZoomToolProps): ReactElement => {
  const { zoomEvent } = props;
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.zooming);
  const allProjectIndices = useSelector((state: RootState) => getAllProjectIndices(state));
  const dispatch = useDispatch();

  const debounceZoomEnd = useCallback(
    debounce(() => {
      dispatch(setCanvasZooming({zooming: false}));
      dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
    }, 50),
    []
  );

  useEffect(() => {
    if (zoomEvent) {
      if (!isEnabled) {
        dispatch(setCanvasZooming({zooming: true}));
      }
      const cursorPoint = uiPaperScope.project.view.getEventPoint(zoomEvent as any);
      const pointDiff = new uiPaperScope.Point(cursorPoint.x - uiPaperScope.view.center.x, cursorPoint.y - uiPaperScope.view.center.y);
      allProjectIndices.forEach((current, index) => {
        const project = uiPaperScope.projects[current];
        const prevZoom = project.view.zoom;
        const nextZoom = project.view.zoom - zoomEvent.deltaY * (0.01 * project.view.zoom);
        if (zoomEvent.deltaY < 0 && nextZoom < 25) {
          project.view.zoom = nextZoom;
        } else if (zoomEvent.deltaY > 0 && nextZoom > 0) {
          project.view.zoom = nextZoom;
        } else if (zoomEvent.deltaY > 0 && nextZoom < 0) {
          project.view.zoom = 0.01;
        }
        const zoomDiff = project.view.zoom - prevZoom;
        project.view.translate(
          new uiPaperScope.Point(
            ((zoomDiff * pointDiff.x) * (1 / project.view.zoom)) * -1,
            ((zoomDiff * pointDiff.y) * (1 / project.view.zoom)) * -1
          )
        );
      });
      debounceZoomEnd();
    }
  }, [zoomEvent]);

  return (
    <></>
  );
}

export default ZoomTool;