/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { ARTBOARDS_PER_PROJECT } from '../constants';
import CanvasProject from './CanvasProject';

const CanvasProjects = (): ReactElement => {
  const rootChildren = useSelector((state: RootState) => state.layer.present.byId.root.children);
  const [projects, setProjects] = useState<number[]>([]);

  useEffect(() => {
    const projectCount = Math.floor(rootChildren.length / ARTBOARDS_PER_PROJECT) + 1;
    const max = Math.max(projects.length, projectCount);
    setProjects([...Array(max).keys()]);
  }, [rootChildren]);

  return (
    projects.length > 0
    ? <>
        {
          projects.map((key, index) => (
            <CanvasProject
              key={index}
              index={index} />
          ))
        }
      </>
    : null
  );
};

export default CanvasProjects;