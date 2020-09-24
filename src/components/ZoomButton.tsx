import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { zoomCanvasThunk, zoomPercentThunk, zoomSelectionThunk } from '../store/actions/zoomTool';
import TopbarDropdownButton from './TopbarDropdownButton';
import ZoomOutButton from './ZoomOutButton';
import ZoomInButton from './ZoomInButton';

interface ZoomButtonProps {
  zoom?: number;
  canArtboardZoom?: boolean;
  canSelectedZoom?: boolean;
  canCanvasZoom?: boolean;
  zoomCanvasThunk?(): void;
  zoomPercentThunk?(percent: number): void;
  zoomSelectionThunk?(): void;
}

const ZoomButton = (props: ZoomButtonProps): ReactElement => {
  const { zoom, zoomCanvasThunk, canArtboardZoom, zoomPercentThunk, zoomSelectionThunk, canSelectedZoom, canCanvasZoom } = props;

  return (
    <div className='c-topbar-button c-topbar-button--split'>
      <ZoomOutButton />
      <TopbarDropdownButton
        label='Zoom'
        text={`${zoom}%`}
        options={[{
          label: '50%',
          onClick: () => zoomPercentThunk(0.5)
        },{
          label: '100%',
          onClick: () => zoomPercentThunk(1)
        },{
          label: '200%',
          onClick: () => zoomPercentThunk(2)
        },{
          label: 'Fit Canvas',
          onClick: zoomCanvasThunk,
          disabled: !canCanvasZoom
        },{
          label: 'Selection',
          onClick: zoomSelectionThunk,
          disabled: !canSelectedZoom
        },{
          label: 'Artboard',
          onClick: zoomSelectionThunk,
          disabled: !canArtboardZoom
        }]} />
      <ZoomInButton />
    </div>
  );
}

const mapStateToProps = (state: RootState): {
  zoom: number;
  canArtboardZoom: boolean;
  canSelectedZoom: boolean;
  canCanvasZoom: boolean;
} => {
  const { layer, documentSettings } = state;
  const selected = layer.present.selected;
  const zoom = Math.round(documentSettings.matrix[0] * 100);
  const canArtboardZoom = selected.length === 1 && layer.present.byId[selected[0]].type === 'Artboard';
  const canSelectedZoom = selected.length > 0;
  const canCanvasZoom = layer.present.allIds.length > 1;
  return { zoom, canArtboardZoom, canSelectedZoom, canCanvasZoom };
};

export default connect(
  mapStateToProps,
  { zoomCanvasThunk, zoomPercentThunk, zoomSelectionThunk }
)(ZoomButton);