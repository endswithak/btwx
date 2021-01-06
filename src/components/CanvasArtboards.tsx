/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { ARTBOARDS_PER_PROJECT } from '../constants';
import CanvasLayer from './CanvasLayer';

const CanvasArtboards = (): ReactElement => {
  const artboardLayers = useSelector((state: RootState) => state.layer.present.byId.root.children);

  return (
    <>
      {
        artboardLayers.map((id, index) => {
          if (index % ARTBOARDS_PER_PROJECT === 0) {
            const project = uiPaperScope.projects[Math.floor(index / ARTBOARDS_PER_PROJECT) + 1];
            project.view.viewSize = uiPaperScope.projects[0].view.viewSize;
            project.view.matrix.set(uiPaperScope.projects[0].view.matrix.values);
          }
          return (
            <CanvasLayer
              key={index}
              id={id} />
          )
        })
      }
    </>
  );
}

export default CanvasArtboards;