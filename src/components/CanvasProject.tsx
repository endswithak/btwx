/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { ARTBOARDS_PER_PROJECT } from '../constants';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import CanvasLayer from './CanvasLayer';

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
  const [prevArtboards, setPrevArtboards] = useState(null);

  useEffect(() => {
    if (ref.current) {
      uiPaperScope.setup(ref.current);
      uiPaperScope.projects[index + 1].view.viewSize = uiPaperScope.projects[0].view.viewSize;
      uiPaperScope.projects[index + 1].view.matrix.set(uiPaperScope.projects[0].view.matrix.values);
    }
    if (isLast) {
      uiPaperScope.projects[0].activate();
    }
  }, []);

  // useEffect(() => {
  //   if (!prevArtboards) {
  //     uiPaperScope.projects[index + 1].view.viewSize = uiPaperScope.projects[0].view.viewSize;
  //     uiPaperScope.projects[index + 1].view.matrix.set(uiPaperScope.projects[0].view.matrix.values);
  //   }
  //   setPrevArtboards(projectArtboards);
  // }, [projectArtboards]);

  return (
    <>
      <canvas
        ref={ref}
        id={`canvas-project-${index}`}
        className='c-canvas__layer c-canvas__layer--project' />
      {
        projectArtboards
        ? projectArtboards.map((id, index) => (
            <CanvasLayer
              key={index}
              id={id} />
          ))
        : null
      }
    </>
  );
}

export default CanvasProject;