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
  isEnabled?: boolean;
  setCanvasZooming?(payload: SetCanvasZoomingPayload): CanvasSettingsTypes;
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): DocumentSettingsTypes;
}

const ZoomTool = (props: ZoomToolProps): ReactElement => {
  const { zoomEvent, isEnabled, setCanvasZooming, setCanvasMatrix } = props;

  const debounceZoomEnd = useCallback(
    debounce(() => {
      setCanvasZooming({zooming: false});
      setCanvasMatrix({matrix: paperMain.projects[0].view.matrix.values});
    }, 50),
    []
  );

  useEffect(() => {
    if (zoomEvent) {
      if (!isEnabled) {
        setCanvasZooming({zooming: true});
      }
      const cursorPoint = paperMain.projects[0].view.getEventPoint(zoomEvent as any);
      const pointDiff = new paperMain.Point(cursorPoint.x - paperMain.projects[0].view.center.x, cursorPoint.y - paperMain.projects[0].view.center.y);
      const prevZoom = paperMain.projects[0].view.zoom;
      const nextZoom = paperMain.projects[0].view.zoom - zoomEvent.deltaY * (0.01 * paperMain.projects[0].view.zoom);
      paperMain.projects.forEach((project, index) => {
        if (zoomEvent.deltaY < 0 && nextZoom < 25) {
          project.view.zoom = nextZoom;
        } else if (zoomEvent.deltaY > 0 && nextZoom > 0) {
          project.view.zoom = nextZoom;
        } else if (zoomEvent.deltaY > 0 && nextZoom < 0) {
          project.view.zoom = 0.01;
        }
        const zoomDiff = project.view.zoom - prevZoom;
        project.view.translate(
          new paperMain.Point(
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