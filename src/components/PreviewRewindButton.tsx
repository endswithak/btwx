import { ipcRenderer } from 'electron';
import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { paperPreview } from '../canvas';
import { RootState } from '../store/reducers';
import { setActiveArtboard } from '../store/actions/layer';
import IconButton from './IconButton';

const PreviewRewindButton = (): ReactElement => {
  const instance = useSelector((state: RootState) => state.session.instance);
  const rewindOrigin = useSelector((state: RootState) => state.eventDrawer.event && state.layer.present.events.byId[state.eventDrawer.event] ? state.layer.present.events.byId[state.eventDrawer.event].artboard : null);
  const rewindOriginItem = useSelector((state: RootState) => rewindOrigin &&  state.layer.present.byId[rewindOrigin] ? state.layer.present.byId[rewindOrigin] : null);
  const canRewind = useSelector((state: RootState) => state.eventDrawer.event !== null && rewindOrigin && rewindOrigin !== state.layer.present.activeArtboard);
  const dispatch = useDispatch();


  const handleRewind = () => {
    if (canRewind) {
      const rewindOriginPosition = new paperPreview.Point(rewindOriginItem.frame.x, rewindOriginItem.frame.y);
      dispatch(setActiveArtboard({id: rewindOrigin}));
      paperPreview.view.center = rewindOriginPosition;
      ipcRenderer.send('setDocumentActiveArtboard', JSON.stringify({
        instanceId: instance,
        activeArtboard: rewindOrigin
      }));
    }
  }

  return (
    <IconButton
      size='small'
      onClick={handleRewind}
      disabled={!canRewind}
      iconName='rewind' />
  );
}

export default PreviewRewindButton;