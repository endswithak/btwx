/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

interface CanvasToastProps {
  isEnabled: boolean;
  text: string;
}

const CanvasToast = (props: CanvasToastProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, text } = props;

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
          color: theme.text.onPrimary,
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

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
  text: string;
} => {
  const { canvasSettings } = state;
  const isEnabled = canvasSettings.drawing || canvasSettings.dragging || canvasSettings.selecting || canvasSettings.resizing || canvasSettings.translating || canvasSettings.zooming;
  const text = (() => {
    if (canvasSettings.drawing) {
      return 'Drawing';
    } else if (canvasSettings.dragging) {
      return 'Dragging';
    } else if (canvasSettings.selecting) {
      return 'Selecting';
    } else if (canvasSettings.resizing) {
      return 'Resizing';
    } else if (canvasSettings.zooming) {
      return 'Zooming';
    } else if (canvasSettings.translating) {
      return 'Scrolling';
    }
  })();
  return {
    isEnabled,
    text
  };
};

export default connect(
  mapStateToProps
)(CanvasToast);