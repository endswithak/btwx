import React, { useEffect, ReactElement } from 'react';
import { paperMain } from '../canvas';

interface CanvasResizeWrapProps {
  children: ReactElement | ReactElement[];
}

const CanvasResizeWrap = (props: CanvasResizeWrapProps): ReactElement => {

  const handleResize = (): void => {
    const canvasWrap = document.getElementById('canvas-container');
    paperMain.view.viewSize = new paperMain.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <>
      { props.children }
    </>
  );
}

export default CanvasResizeWrap;