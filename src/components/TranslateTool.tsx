import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { disableTranslateToolThunk } from '../store/actions/translateTool';
import debounce from 'lodash.debounce';

interface TranslateToolProps {
  disableTranslateToolThunk?(): void;
}

const TranslateTool = (props: TranslateToolProps): ReactElement => {
  const { disableTranslateToolThunk } = props;

  const handleWheel = debounce((e: any) => {
    disableTranslateToolThunk();
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
  { disableTranslateToolThunk }
)(TranslateTool);