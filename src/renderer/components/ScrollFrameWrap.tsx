import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import ScrollFrame from './ScrollFrame';

const ScrollFrameWrap = (): ReactElement => {
  const isScrollFrameToolActive = useSelector((state: RootState) => state.scrollFrameTool.isEnabled);

  return (
    isScrollFrameToolActive
    ? <ScrollFrame />
    : null
  );
}

export default ScrollFrameWrap;