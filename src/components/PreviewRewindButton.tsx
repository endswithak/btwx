import { remote } from 'electron';
import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { paperPreview } from '../canvas';
import { RootState } from '../store/reducers';
import { setActiveArtboard } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

const PreviewRewindButton = (): ReactElement => {
  const rewindOrigin = useSelector((state: RootState) => state.eventDrawer.event ? state.layer.present.events.byId[state.eventDrawer.event].artboard : null);
  const rewindOriginItem = useSelector((state: RootState) => rewindOrigin ? state.layer.present.byId[rewindOrigin] : null);
  const canRewind = useSelector((state: RootState) => state.eventDrawer.event !== null && rewindOrigin && rewindOrigin !== state.layer.present.activeArtboard);
  const documentWindowId = useSelector((state: RootState) => state.preview.documentWindowId);
  const dispatch = useDispatch();


  const handleRewind = () => {
    if (canRewind) {
      const rewindOriginPosition = new paperPreview.Point(rewindOriginItem.frame.x, rewindOriginItem.frame.y);
      dispatch(setActiveArtboard({id: rewindOrigin}));
      paperPreview.view.center = rewindOriginPosition;
      remote.BrowserWindow.fromId(documentWindowId).webContents.executeJavaScript(`setActiveArtboard(${JSON.stringify(rewindOrigin)})`);
    }
  }

  return (
    <TopbarButton
      onClick={handleRewind}
      icon='rewind'
      disabled={!canRewind} />
  );
}

export default PreviewRewindButton;