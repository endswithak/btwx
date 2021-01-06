/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { MAX_PROJECT_COUNT } from '../constants';
import CanvasProject from './CanvasProject';

const CanvasProjects = (): ReactElement => (
  <>
    {
      [...Array(MAX_PROJECT_COUNT).keys()].map((key, index) => (
        <CanvasProject
          key={index}
          index={index}
          isLast={index === MAX_PROJECT_COUNT - 1} />
      ))
    }
  </>
);

export default CanvasProjects;