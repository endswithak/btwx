/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { ARTBOARDS_PER_PROJECT } from '../constants';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import CanvasArtboardLayer from './CanvasArtboardLayer';

interface CanvasProjectProps {
  index: number;
}

const getProjectArtboardsSelector = () =>
  createSelector(
    (state: RootState) => state.layer.present.byId.root.children,
    (_: any, index: number) => index,
    (artboards, projectIndex) => artboards.slice(
      ARTBOARDS_PER_PROJECT * projectIndex,
      (ARTBOARDS_PER_PROJECT * projectIndex) + ARTBOARDS_PER_PROJECT
    )
  );

const CanvasProject = (props: CanvasProjectProps): ReactElement => {
  const { index } = props;
  const artboardsSelector = useMemo(getProjectArtboardsSelector, []);
  const projectArtboards = useSelector((state: RootState) => artboardsSelector(state, index));
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);
  const ref = useRef<HTMLCanvasElement>(null);
  const [projectReady, setProjectReady] = useState(false);

  useEffect(() => {
    if (projectArtboards.length !== 0 && paperMain.projects[index + 1]) {
      paperMain.projects[index + 1].view.viewSize = paperMain.projects[0].view.viewSize;
      paperMain.projects[index + 1].view.matrix.set(paperMain.projects[0].view.matrix.values);
    }
  }, [projectArtboards]);

  useEffect(() => {
    if (ref.current) {
      paperMain.setup(ref.current);
      paperMain.project.view.viewSize = paperMain.projects[0].view.viewSize;
      paperMain.project.view.matrix.set(paperMain.projects[0].view.matrix.values);
      setProjectReady(true);
    }
  }, []);

  return (
    <>
      <canvas
        ref={ref}
        id={`canvas-project-${index}`}
        className='c-canvas__layer c-canvas__layer--project'
        style={{
          visibility: projectArtboards.length === 0 ? 'hidden' : 'visible'
        }} />
      {
        ready && projectReady && projectArtboards
        ? projectArtboards.map((id, artboardIndex) => (
            <CanvasArtboardLayer
              key={`${id}-${index}-${artboardIndex}`}
              id={id}
              paperScope='main' />
          ))
        : null
      }
    </>
  );
}

export default CanvasProject;