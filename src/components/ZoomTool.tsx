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
  artboards?: string[];
  setCanvasZooming?(payload: SetCanvasZoomingPayload): CanvasSettingsTypes;
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): DocumentSettingsTypes;
}

const ZoomTool = (props: ZoomToolProps): ReactElement => {
  const { zoomEvent, isEnabled, setCanvasZooming, setCanvasMatrix, artboards } = props;

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
      artboards.forEach((key, index) => {
        const prevZoom = uiPaperScope.projects[index].view.zoom;
        const nextZoom = uiPaperScope.projects[index].view.zoom - zoomEvent.deltaY * (0.01 * uiPaperScope.projects[index].view.zoom);
        if (zoomEvent.deltaY < 0 && nextZoom < 25) {
          uiPaperScope.projects[index].view.zoom = nextZoom;
        } else if (zoomEvent.deltaY > 0 && nextZoom > 0) {
          uiPaperScope.projects[index].view.zoom = nextZoom;
        } else if (zoomEvent.deltaY > 0 && nextZoom < 0) {
          uiPaperScope.projects[index].view.zoom = 0.01;
        }
        const zoomDiff = uiPaperScope.projects[index].view.zoom - prevZoom;
        uiPaperScope.projects[index].view.translate(
          new uiPaperScope.Point(
            ((zoomDiff * pointDiff.x) * (1 / uiPaperScope.projects[index].view.zoom)) * -1,
            ((zoomDiff * pointDiff.y) * (1 / uiPaperScope.projects[index].view.zoom)) * -1
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
  artboards: string[];
} => {
  const { canvasSettings, layer } = state;
  const isEnabled = canvasSettings.zooming;
  return {
    isEnabled,
    artboards: ['ui', ...layer.present.childrenById.root]
  };
};

export default connect(
  mapStateToProps,
  { setCanvasZooming, setCanvasMatrix }
)(ZoomTool);