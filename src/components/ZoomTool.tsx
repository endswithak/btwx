/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import { getAllPaperScopes } from '../store/selectors/layer';
import { setCanvasZooming } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasZoomingPayload } from '../store/actionTypes/canvasSettings';
import { setCanvasMatrix } from '../store/actions/documentSettings';
import { DocumentSettingsTypes, SetCanvasMatrixPayload } from '../store/actionTypes/documentSettings';

interface ZoomToolProps {
  zoomEvent: WheelEvent;
  isEnabled?: boolean;
  allPaperScopes?: {
    [id: string]: number;
  };
  setCanvasZooming?(payload: SetCanvasZoomingPayload): CanvasSettingsTypes;
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): DocumentSettingsTypes;
}

const ZoomTool = (props: ZoomToolProps): ReactElement => {
  const { zoomEvent, isEnabled, setCanvasZooming, setCanvasMatrix, allPaperScopes } = props;

  const debounceZoomEnd = useCallback(
    debounce(() => {
      setCanvasZooming({zooming: false});
      setCanvasMatrix({matrix: uiPaperScope.view.matrix.values});
    }, 50),
    []
  );

  useEffect(() => {
    if (zoomEvent) {
      if (!isEnabled) {
        setCanvasZooming({zooming: true});
      }
      const cursorPoint = uiPaperScope.project.view.getEventPoint(zoomEvent as any);
      const pointDiff = new uiPaperScope.Point(cursorPoint.x - uiPaperScope.view.center.x, cursorPoint.y - uiPaperScope.view.center.y);
      Object.keys(allPaperScopes).forEach((key, index) => {
        const paperScope = uiPaperScope.projects[allPaperScopes[key]];
        const prevZoom = paperScope.view.zoom;
        const nextZoom = paperScope.view.zoom - zoomEvent.deltaY * (0.01 * paperScope.view.zoom);
        if (zoomEvent.deltaY < 0 && nextZoom < 25) {
          paperScope.view.zoom = nextZoom;
        } else if (zoomEvent.deltaY > 0 && nextZoom > 0) {
          paperScope.view.zoom = nextZoom;
        } else if (zoomEvent.deltaY > 0 && nextZoom < 0) {
          paperScope.view.zoom = 0.01;
        }
        const zoomDiff = paperScope.view.zoom - prevZoom;
        paperScope.view.translate(
          new uiPaperScope.Point(
            ((zoomDiff * pointDiff.x) * (1 / paperScope.view.zoom)) * -1,
            ((zoomDiff * pointDiff.y) * (1 / paperScope.view.zoom)) * -1
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

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
  allPaperScopes: {
    [id: string]: number;
  };
} => {
  const { canvasSettings } = state;
  const isEnabled = canvasSettings.zooming;
  return {
    isEnabled,
    allPaperScopes: getAllPaperScopes(state)
  };
};

export default connect(
  mapStateToProps,
  { setCanvasZooming, setCanvasMatrix }
)(ZoomTool);