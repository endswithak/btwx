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
  paperScopes?: {
    [id: string]: paper.PaperScope;
  };
  setCanvasZooming?(payload: SetCanvasZoomingPayload): CanvasSettingsTypes;
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): DocumentSettingsTypes;
}

const ZoomTool = (props: ZoomToolProps): ReactElement => {
  const { zoomEvent, isEnabled, setCanvasZooming, setCanvasMatrix, paperScopes } = props;

  const debounceZoomEnd = useCallback(
    debounce(() => {
      setCanvasZooming({zooming: false});
      setCanvasMatrix({matrix: uiPaperScope.view.matrix.values, zoom: uiPaperScope.view.zoom});
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
      const prevZoom = uiPaperScope.view.zoom;
      const nextZoom = uiPaperScope.view.zoom - zoomEvent.deltaY * (0.01 * uiPaperScope.view.zoom);
      if (zoomEvent.deltaY < 0 && nextZoom < 25) {
        uiPaperScope.view.zoom = nextZoom;
      } else if (zoomEvent.deltaY > 0 && nextZoom > 0) {
        uiPaperScope.view.zoom = nextZoom;
      } else if (zoomEvent.deltaY > 0 && nextZoom < 0) {
        uiPaperScope.view.zoom = 0.01;
      }
      const zoomDiff = uiPaperScope.view.zoom - prevZoom;
      uiPaperScope.view.translate(
        new uiPaperScope.Point(
          ((zoomDiff * pointDiff.x) * (1 / uiPaperScope.view.zoom)) * -1,
          ((zoomDiff * pointDiff.y) * (1 / uiPaperScope.view.zoom)) * -1
        )
      );
      Object.keys(paperScopes).forEach((key, index) => {
        paperScopes[key].view.matrix.set(uiPaperScope.view.matrix.values);
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
  paperScopes: {
    [id: string]: paper.PaperScope;
  };
} => {
  const { canvasSettings } = state;
  const isEnabled = canvasSettings.zooming;
  return {
    isEnabled,
    paperScopes: getAllPaperScopes(state)
  };
};

export default connect(
  mapStateToProps,
  { setCanvasZooming, setCanvasMatrix }
)(ZoomTool);