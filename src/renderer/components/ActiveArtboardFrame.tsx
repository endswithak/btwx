import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateActiveArtboardFrame } from '../store/actions/layer';
import { paperMain } from '../canvas';
import { getActiveArtboardBounds } from '../store/selectors/layer';

const ActiveArtboardFrame = (): ReactElement => {
  const activeArtboardBounds = useSelector((state: RootState) => getActiveArtboardBounds(state));
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);

  useEffect(() => {
    updateActiveArtboardFrame(activeArtboardBounds);
    return () => {
      const activeArtboardFrame = paperMain.projects[0].getItem({ data: { id: 'activeArtboardFrame' } });
      activeArtboardFrame.removeChildren();
    }
  }, [activeArtboardBounds, zoom]);

  return null;
}

export default ActiveArtboardFrame;