import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { disableZoomToolThunk } from '../store/actions/zoomTool';
import debounce from 'lodash.debounce';

interface ZoomToolProps {
  disableZoomToolThunk?(): void;
}

const ZoomTool = (props: ZoomToolProps): ReactElement => {
  const { disableZoomToolThunk } = props;

  const handleWheel = debounce((e: any) => {
    disableZoomToolThunk();
  }, 50);

  useEffect(() => {
    const canvasWrap = document.getElementById('canvas-container');
    canvasWrap.addEventListener('wheel', handleWheel);
    handleWheel();
    return () => {
      canvasWrap.removeEventListener('wheel', handleWheel);
    }
  }, []);

  return (
    <></>
  );
}

export default connect(
  null,
  { disableZoomToolThunk }
)(ZoomTool);