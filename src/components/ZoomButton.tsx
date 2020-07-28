import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { LayerState } from '../store/reducers/layer';
import { connect } from 'react-redux';
import TopbarDropdownButton from './TopbarDropdownButton';
import { paperMain } from '../canvas';
import { SetCanvasMatrixPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasMatrix } from '../store/actions/canvasSettings';
import { getSelectionBounds, getCanvasBounds, getSelectionCenter, getCanvasCenter } from '../store/selectors/layer';
import ZoomOutButton from './ZoomOutButton';
import ZoomInButton from './ZoomInButton';

interface ZoomButtonProps {
  zoom?: number;
  selected?: string[];
  canArtboardZoom?: boolean;
  canSelectedZoom?: boolean;
  canCanvasZoom?: boolean;
  allLayerIds: string[];
  layerById?: {
    [id: string]: em.Layer;
  };
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): CanvasSettingsTypes;
}

const ZoomButton = (props: ZoomButtonProps): ReactElement => {
  const { zoom, selected, canArtboardZoom, allLayerIds, layerById, canSelectedZoom, canCanvasZoom, setCanvasMatrix } = props;

  const handlePercentageZoom = (percentage: number) => {
    paperMain.view.zoom = percentage;
    setCanvasMatrix({matrix: paperMain.view.matrix.values});
  }

  const handleCanvasZoom = () => {
    if (canCanvasZoom) {
      const canvasBounds = getCanvasBounds({allIds: allLayerIds, byId: layerById} as LayerState, true);
      const canvasCenter = getCanvasCenter({allIds: allLayerIds, byId: layerById} as LayerState, true);
      const viewWidth: number = paperMain.view.bounds.width;
      const viewHeight: number = paperMain.view.bounds.height;
      const canvasWidth: number = canvasBounds.width;
      const canvasHeight: number = canvasBounds.height;
      const viewRatio: number = viewWidth / viewHeight;
      const canvasRatio: number = canvasWidth / canvasHeight;
      const constrainingDim = viewRatio > canvasRatio ? {dim: canvasHeight, type: 'height'} : {dim: canvasWidth, type: 'width'};
      const viewDim = (() => {
        switch(constrainingDim.type) {
          case 'height':
            return viewHeight;
          case 'width':
            return viewWidth;
        }
      })();
      const newZoom = (viewDim / constrainingDim.dim) * paperMain.view.zoom;
      paperMain.view.center = canvasCenter;
      paperMain.view.zoom = newZoom;
      setCanvasMatrix({matrix: paperMain.view.matrix.values});
    }
  }

  const handleSelectionZoom = () => {
    if (canSelectedZoom || canArtboardZoom) {
      const selectionBounds = getSelectionBounds({selected: selected, byId: layerById} as LayerState, true);
      const selectionCenter = getSelectionCenter({selected: selected, byId: layerById} as LayerState, true);
      const viewWidth: number = paperMain.view.bounds.width;
      const viewHeight: number = paperMain.view.bounds.height;
      const selectionWidth: number = selectionBounds.width;
      const selectionHeight: number = selectionBounds.height;
      const viewRatio: number = viewWidth / viewHeight;
      const selectionRatio: number = selectionWidth / selectionHeight;
      const constrainingDim = viewRatio > selectionRatio ? {dim: selectionHeight, type: 'height'} : {dim: selectionWidth, type: 'width'};
      const viewDim = (() => {
        switch(constrainingDim.type) {
          case 'height':
            return viewHeight;
          case 'width':
            return viewWidth;
        }
      })();
      const newZoom = (viewDim / constrainingDim.dim) * paperMain.view.zoom;
      paperMain.view.center = selectionCenter;
      paperMain.view.zoom = newZoom;
      setCanvasMatrix({matrix: paperMain.view.matrix.values});
    }
  }

  return (
    <div className='c-topbar-button c-topbar-button--split'>
      <ZoomOutButton />
      <TopbarDropdownButton
        label='Zoom'
        text={`${zoom}%`}
        options={[{
          label: '50%',
          onClick: () => handlePercentageZoom(0.5)
        },{
          label: '100%',
          onClick: () => handlePercentageZoom(1)
        },{
          label: '200%',
          onClick: () => handlePercentageZoom(2)
        },{
          label: 'Fit Canvas',
          onClick: handleCanvasZoom,
          disabled: !canCanvasZoom
        },{
          label: 'Selection',
          onClick: handleSelectionZoom,
          disabled: !canSelectedZoom
        },{
          label: 'Artboard',
          onClick: handleSelectionZoom,
          disabled: !canArtboardZoom
        }]} />
      <ZoomInButton />
    </div>
  );
}

const mapStateToProps = (state: RootState): {
  zoom: number;
  selected: string[];
  canArtboardZoom: boolean;
  canSelectedZoom: boolean;
  canCanvasZoom: boolean;
  layerById: {
    [id: string]: em.Layer;
  };
  allLayerIds: string[];
} => {
  const { canvasSettings, layer } = state;
  const selected = layer.present.selected;
  const zoom = Math.round(canvasSettings.matrix[0] * 100);
  const canArtboardZoom = selected.length === 1 && layer.present.byId[selected[0]].type === 'Artboard';
  const canSelectedZoom = selected.length > 0;
  const canCanvasZoom = layer.present.allIds.length > 1;
  const layerById = layer.present.byId;
  const allLayerIds = layer.present.allIds;
  return { zoom, selected, canArtboardZoom, canSelectedZoom, canCanvasZoom, layerById, allLayerIds };
};

export default connect(
  mapStateToProps,
  { setCanvasMatrix }
)(ZoomButton);