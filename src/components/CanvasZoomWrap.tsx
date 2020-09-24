import React, { useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { disableZoomToolThunk } from '../store/actions/zoomTool';

interface CanvasZoomWrapProps {
  children: ReactElement | ReactElement[];
  disableZoomToolThunk?(): void;
}

const CanvasZoomWrap = (props: CanvasZoomWrapProps): ReactElement => {
  const { children, disableZoomToolThunk } = props;

  const handleWheel = debounce((e: any) => {
    disableZoomToolThunk();
  }, 150);

  useEffect(() => {
    const canvasWrap = document.getElementById('canvas-container');
    canvasWrap.addEventListener('wheel', handleWheel);
    return () => {
      canvasWrap.removeEventListener('wheel', handleWheel);
    }
  }, []);

  return (
    <>
      { children }
    </>
  );
}

export default connect(
  null,
  { disableZoomToolThunk }
)(CanvasZoomWrap);