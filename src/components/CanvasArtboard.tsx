/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { importProjectJSON } from '../store/selectors/layer';

interface CanvasArtboardProps {
  id: string;
}

const CanvasArtboard = (props: CanvasArtboardProps): ReactElement => {
  const { id } = props;
  const projectIndex = useSelector((state: RootState) => (state.layer.present.byId[id] as Btwx.Artboard).projectIndex);
  const json = useSelector((state: RootState) => (state.layer.present.byId[id] as Btwx.Artboard).json);
  const documentImages = useSelector((state: RootState) => state.documentSettings.images.byId);

  useEffect(() => {
    const project = uiPaperScope.projects[projectIndex];
    importProjectJSON({
      documentImages,
      json,
      project
    });
    return () => {
      const item = uiPaperScope.projects[projectIndex].getItem({data: {id}});
      if (item) {
        item.remove();
      }
    }
  }, [id]);

  return (
    <></>
  );
}

export default CanvasArtboard;