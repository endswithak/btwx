import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { zoomFitCanvasThunk, zoomPercentThunk, zoomFitSelectedThunk, zoomFitActiveArtboardThunk } from '../store/actions/zoomTool';
import TopbarDropdownButton from './TopbarDropdownButton';
import ZoomOutButton from './ZoomOutButton';
import ZoomInButton from './ZoomInButton';

interface ZoomButtonProps {
  zoom?: number;
  canArtboardZoom?: boolean;
  canSelectedZoom?: boolean;
  canCanvasZoom?: boolean;
  zoomFitCanvasThunk?(): void;
  zoomPercentThunk?(percent: number): void;
  zoomFitSelectedThunk?(): void;
  zoomFitActiveArtboardThunk?(): void;
}

const ZoomButton = (props: ZoomButtonProps): ReactElement => {
  const { zoom, zoomFitCanvasThunk, canArtboardZoom, zoomPercentThunk, zoomFitSelectedThunk, zoomFitActiveArtboardThunk, canSelectedZoom, canCanvasZoom } = props;

  return (
    <>
      <ZoomOutButton />
      <TopbarDropdownButton
        dropdownPosition='left'
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
          onClick: () => zoomPercentThunk(2),
          bottomDivider: true
        },{
          label: 'Canvas',
          onClick: zoomFitCanvasThunk,
          disabled: !canCanvasZoom
        },{
          label: 'Selection',
          onClick: zoomFitSelectedThunk,
          disabled: !canSelectedZoom
        },{
          label: 'Active Artboard',
          onClick: zoomFitActiveArtboardThunk,
          disabled: !canArtboardZoom
        }]} />
      <ZoomInButton />
    </>
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
  const canArtboardZoom = layer.present.activeArtboard !== null;
  const canSelectedZoom = selected.length > 0;
  const canCanvasZoom = layer.present.allIds.length > 1;
  return { zoom, canArtboardZoom, canSelectedZoom, canCanvasZoom };
};

export default connect(
  mapStateToProps,
  { zoomFitCanvasThunk, zoomPercentThunk, zoomFitSelectedThunk, zoomFitActiveArtboardThunk }
)(ZoomButton);