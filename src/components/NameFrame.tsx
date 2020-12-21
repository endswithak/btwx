import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateNameFrame } from '../store/actions/layer';
import { getAllArtboardItems } from '../store/selectors/layer';
import { uiPaperScope } from '../canvas';

const NameFrame = (): ReactElement => {
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);
  const artboards = useSelector((state: RootState) => getAllArtboardItems(state));

  useEffect(() => {
    updateNameFrame(artboards);
    return (): void => {
      const activeArtboardFrame = uiPaperScope.projects[0].getItem({ data: { id: 'nameFrame' } });
      activeArtboardFrame.removeChildren();
    }
  }, [zoom, artboards]);

  return (
    <></>
  );
}

export default NameFrame;