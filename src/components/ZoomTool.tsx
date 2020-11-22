/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasZooming } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasZoomingPayload } from '../store/actionTypes/canvasSettings';
import { setCanvasMatrix } from '../store/actions/documentSettings';
import { DocumentSettingsTypes, SetCanvasMatrixPayload } from '../store/actionTypes/documentSettings';

interface ZoomToolProps {
  zoomEvent: WheelEvent;
  paperScopes: {
    [id: number]: paper.PaperScope;
  };
  isEnabled?: boolean;
  setCanvasZooming?(payload: SetCanvasZoomingPayload): CanvasSettingsTypes;
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): DocumentSettingsTypes;
}

const ZoomTool = (props: ZoomToolProps): ReactElement => {
  const { zoomEvent, isEnabled, setCanvasZooming, setCanvasMatrix, paperScopes } = props;

  const debounceZoomEnd = useCallback(
    debounce(() => {
      setCanvasZooming({zooming: false});
      // setCanvasMatrix({matrix: paperMain.view.matrix.values});
    }, 50),
    []
  );

  useEffect(() => {
    if (zoomEvent && paperScopes) {
      if (!isEnabled) {
        setCanvasZooming({zooming: true});
      }
      const cursorPoint = paperScopes[0].view.getEventPoint(zoomEvent as any);
      const pointDiff = new paperScopes[0].Point(cursorPoint.x - paperScopes[0].view.center.x, cursorPoint.y - paperScopes[0].view.center.y);
      const prevZoom = paperScopes[0].view.zoom;
      const nextZoom = paperScopes[0].view.zoom - zoomEvent.deltaY * (0.01 * paperScopes[0].view.zoom);
      Object.keys(paperScopes).forEach((key, index) => {
        const scope = paperScopes[index];
        if (zoomEvent.deltaY < 0 && nextZoom < 25) {
          scope.view.zoom = nextZoom;
        } else if (zoomEvent.deltaY > 0 && nextZoom > 0) {
          scope.view.zoom = nextZoom;
        } else if (zoomEvent.deltaY > 0 && nextZoom < 0) {
          scope.view.zoom = 0.01;
        }
        const zoomDiff = scope.view.zoom - prevZoom;
        scope.view.translate(
          new paperMain.Point(
            ((zoomDiff * pointDiff.x) * (1 / scope.view.zoom)) * -1,
            ((zoomDiff * pointDiff.y) * (1 / scope.view.zoom)) * -1
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
} => {
  const { canvasSettings } = state;
  const isEnabled = canvasSettings.zooming;
  return {
    isEnabled
  };
};

export default connect(
  mapStateToProps,
  { setCanvasZooming, setCanvasMatrix }
)(ZoomTool);