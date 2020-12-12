/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { ARTBOARDS_PER_SCOPE } from '../constants';
import CanvasArtboard from './CanvasArtboard';

interface CanvasArtboardsProps {
  ready?: boolean;
}

const CanvasArtboards = (props: CanvasArtboardsProps): ReactElement => {
  const { ready } = props;
  const artboards = useSelector((state: RootState) => state.layer.present.byId.root.children);

  useEffect(() => {
    [...Array(11).keys()].forEach((scope, index) => {
      new uiPaperScope.Project(document.getElementById(`canvas-artboard-${index}`) as HTMLCanvasElement);
      new uiPaperScope.Layer();
    });
    uiPaperScope.projects[0].activate();
  }, []);

  return (
    <>
      {
        [...Array(11).keys()].map((key, index) => (
          <canvas
            key={index}
            id={`canvas-artboard-${index}`}
            className='c-canvas__layer c-canvas__layer--artboard' />
        ))
      }
      <>
        {
          ready
          ? artboards.map((id, index) => {
              if (index % ARTBOARDS_PER_SCOPE === 0) {
                const project = uiPaperScope.projects[Math.floor(index / ARTBOARDS_PER_SCOPE) + 1];
                project.view.viewSize = uiPaperScope.projects[0].view.viewSize;
                project.view.matrix.set(uiPaperScope.projects[0].view.matrix.values);
              }
              return (
                <CanvasArtboard
                  key={index}
                  id={id} />
              )
            })
          : null
        }
      </>
    </>
  );
}

export default CanvasArtboards;