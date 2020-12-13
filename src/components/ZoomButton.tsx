import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { zoomFitCanvasThunk, zoomPercentThunk, zoomFitSelectedThunk, zoomFitActiveArtboardThunk } from '../store/actions/zoomTool';
import TopbarDropdownButton from './TopbarDropdownButton';
import ZoomOutButton from './ZoomOutButton';
import ZoomInButton from './ZoomInButton';

const ZoomButton = (): ReactElement => {
  const zoom = useSelector((state: RootState) => Math.round(state.documentSettings.matrix[0] * 100));
  const canArtboardZoom = useSelector((state: RootState) => state.layer.present.activeArtboard !== null)
  const canSelectedZoom = useSelector((state: RootState) => state.layer.present.selected.length > 0);
  const canCanvasZoom = useSelector((state: RootState) => state.layer.present.allIds.length > 1);
  const dispatch = useDispatch();

  return (
    <>
      <ZoomOutButton />
      <TopbarDropdownButton
        dropdownPosition='left'
        label='Zoom'
        text={`${zoom}%`}
        options={[{
          label: '50%',
          onClick: () => dispatch(zoomPercentThunk(0.5))
        },{
          label: '100%',
          onClick: () => dispatch(zoomPercentThunk(1))
        },{
          label: '200%',
          onClick: () => dispatch(zoomPercentThunk(2)),
          bottomDivider: true
        },{
          label: 'Canvas',
          onClick: () => dispatch(zoomFitCanvasThunk()),
          disabled: !canCanvasZoom
        },{
          label: 'Selection',
          onClick: () => dispatch(zoomFitSelectedThunk()),
          disabled: !canSelectedZoom
        },{
          label: 'Active Artboard',
          onClick: () => dispatch(zoomFitActiveArtboardThunk()),
          disabled: !canArtboardZoom
        }]} />
      <ZoomInButton />
    </>
  );
}

export default ZoomButton;