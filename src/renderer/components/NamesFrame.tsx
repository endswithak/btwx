import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateNameFrame } from '../store/actions/layer';
import { getAllArtboardItems } from '../store/selectors/layer';
import { paperMain } from '../canvas';

export const namesFrameId = 'namesFrame';

export const namesFrameJSON = `[
  "Group", {
    "applyMatrix": true,
    "name": "Name Frame",
    "data":{
      "id": "${namesFrameId}",
      "type": "UIElement"
    }
  }
]`;

const NamesFrame = (): ReactElement => {
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);
  const artboards = useSelector((state: RootState) => getAllArtboardItems(state));

  useEffect(() => {
    updateNameFrame(artboards);
    return (): void => {
      const namesFrame = paperMain.projects[0].getItem({ data: { id: namesFrameId } });
      namesFrame.removeChildren();
    }
  }, [zoom, artboards]);

  return null;
}

export default NamesFrame;