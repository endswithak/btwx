import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

interface MenuViewZoomProps {
  canZoomOut?: boolean;
  canArtboardZoom?: boolean;
  canSelectedZoom?: boolean;
  canCanvasZoom?: boolean;
}

const MenuViewZoom = (props: MenuViewZoomProps): ReactElement => {
  const { canZoomOut, canArtboardZoom, canSelectedZoom, canCanvasZoom } = props;

  useEffect(() => {
    setMenuItems({
      viewZoomIn: {
        id: 'viewZoomIn',
        enabled: true
      },
      viewZoomOut: {
        id: 'viewZoomOut',
        enabled: canZoomOut
      },
      viewZoomFitCanvas: {
        id: 'viewZoomFitCanvas',
        enabled: canCanvasZoom
      },
      viewZoomFitSelection: {
        id: 'viewZoomFitSelection',
        enabled: canSelectedZoom
      },
      viewZoomFitArtboard: {
        id: 'viewZoomFitArtboard',
        enabled: canArtboardZoom
      },
      viewCenterSelection: {
        id: 'viewCenterSelection',
        enabled: canSelectedZoom
      }
    });
  }, [canZoomOut, canArtboardZoom, canSelectedZoom, canCanvasZoom]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canZoomOut: boolean;
  canArtboardZoom: boolean;
  canSelectedZoom: boolean;
  canCanvasZoom: boolean;
} => {
  const { layer, documentSettings } = state;
  const selected = layer.present.selected;
  const canZoomOut = documentSettings.matrix[0] !== 0.01;
  const canArtboardZoom = selected.length === 1 && layer.present.byId[selected[0]].type === 'Artboard';
  const canSelectedZoom = selected.length > 0;
  const canCanvasZoom = layer.present.allIds.length > 1;
  return { canZoomOut, canArtboardZoom, canSelectedZoom, canCanvasZoom };
};

export default connect(
  mapStateToProps
)(MenuViewZoom);