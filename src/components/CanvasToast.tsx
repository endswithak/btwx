/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

const CanvasToast = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.drawing || state.canvasSettings.dragging || state.canvasSettings.selecting || state.canvasSettings.resizing || state.canvasSettings.translating || state.canvasSettings.zooming);
  const text = useSelector((state: RootState) => (() => {
    if (state.canvasSettings.drawing) {
      return 'Drawing';
    } else if (state.canvasSettings.dragging) {
      return 'Dragging';
    } else if (state.canvasSettings.selecting) {
      return 'Selecting';
    } else if (state.canvasSettings.resizing) {
      return 'Resizing';
    } else if (state.canvasSettings.zooming) {
      return 'Zooming';
    } else if (state.canvasSettings.translating) {
      return 'Scrolling';
    }
  })());

  return (
    isEnabled
    ? <div
        className='c-canvas-toast'
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          borderRadius: 4,
          background: theme.palette.primary,
          color: theme.text.onPalette.primary,
          fontFamily: 'Space Mono',
          fontSize: 12,
          paddingLeft: 8,
          paddingRight: 8,
          height: 24,
          lineHeight: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          zIndex: 9999999999999
        }}>
        { text }
      </div>
    : null
  );
}

export default CanvasToast;