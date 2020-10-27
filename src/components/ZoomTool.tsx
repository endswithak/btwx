/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getDeepSelectItem, getNearestScopeAncestor, getSelectionBounds, getPaperLayer } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasActiveTool, setCanvasZooming } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasActiveToolPayload, SetCanvasZoomingPayload } from '../store/actionTypes/canvasSettings';
import { moveLayersBy, duplicateLayers, removeDuplicatedLayers } from '../store/actions/layer';
import { LayerTypes, MoveLayersByPayload, DuplicateLayersPayload, RemoveDuplicatedLayersPayload } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';

interface ZoomToolProps {
  zoomEvent: WheelEvent;
  isEnabled?: boolean;
  setCanvasZooming?(payload: SetCanvasZoomingPayload): CanvasSettingsTypes;
}

const ZoomTool = (props: ZoomToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { zoomEvent, isEnabled, setCanvasZooming } = props;

  const debounceZoom = useCallback(
    debounce(() => {
      setCanvasZooming({zooming: false});
    }, 100),
    []
  );

  useEffect(() => {
    if (zoomEvent) {
      if (!isEnabled) {
        setCanvasZooming({zooming: true});
      }
      const cursorPoint = paperMain.view.getEventPoint(zoomEvent as any);
      const pointDiff = new paperMain.Point(cursorPoint.x - paperMain.view.center.x, cursorPoint.y - paperMain.view.center.y);
      const prevZoom = paperMain.view.zoom;
      const nextZoom = paperMain.view.zoom - zoomEvent.deltaY * 0.01;
      if (zoomEvent.deltaY < 0 && nextZoom < 30) {
        paperMain.view.zoom = nextZoom;
      } else if (zoomEvent.deltaY > 0 && nextZoom > 0) {
        paperMain.view.zoom = nextZoom;
      } else if (zoomEvent.deltaY > 0 && nextZoom < 0) {
        paperMain.view.zoom = 0.01;
      }
      const zoomDiff = paperMain.view.zoom - prevZoom;
      paperMain.view.translate(
        new paperMain.Point(
          ((zoomDiff * pointDiff.x) * ( 1 / paperMain.view.zoom)) * -1,
          ((zoomDiff * pointDiff.y) * ( 1 / paperMain.view.zoom)) * -1
        )
      );
      debounceZoom();
    }
  }, [zoomEvent]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: ZoomToolProps): {
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
  { setCanvasZooming }
)(ZoomTool);