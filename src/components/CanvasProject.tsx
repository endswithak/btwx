/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { ARTBOARDS_PER_PROJECT } from '../constants';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import CanvasArtboardLayer from './CanvasArtboardLayer';

interface CanvasProjectProps {
  index: number;
  isLast: boolean;
}

const getProjectArtboards = createSelector(
  (state: RootState) => state.layer.present.byId.root.children,
  (_: any, index: number) => index,
  (artboards, projectIndex) => artboards.slice(ARTBOARDS_PER_PROJECT * projectIndex, (ARTBOARDS_PER_PROJECT * projectIndex) + 3)
)

const CanvasProject = (props: CanvasProjectProps): ReactElement => {
  const { index, isLast } = props;
  const ref = useRef<HTMLCanvasElement>(null);
  const projectArtboards = useSelector((state: RootState) => ARTBOARDS_PER_PROJECT * index < state.layer.present.byId.root.children.length ? getProjectArtboards(state, index) : null);

  useEffect(() => {
    if (ref.current) {
      paperMain.setup(ref.current);
    }
    if (isLast) {
      paperMain.projects[0].activate();
    }
  }, []);

  return (
    <>
      <canvas
        ref={ref}
        id={`canvas-project-${index}`}
        className='c-canvas__layer c-canvas__layer--project' />
      {
        projectArtboards
        ? projectArtboards.map((id, i) => {
            if (i % ARTBOARDS_PER_PROJECT === 0) {
              const project = paperMain.projects[index + 1];
              project.view.viewSize = paperMain.projects[0].view.viewSize;
              project.view.matrix.set(paperMain.projects[0].view.matrix.values);
            }
            return (
              <CanvasArtboardLayer
                key={id}
                id={id}
                paperScope='main' />
            );
          })
        : null
      }
    </>
  );
}

export default CanvasProject;