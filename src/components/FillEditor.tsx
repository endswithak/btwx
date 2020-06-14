import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeFillEditor } from '../store/actions/fillEditor';
import { FillEditorTypes } from '../store/actionTypes/fillEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { FillEditorState } from '../store/reducers/fillEditor';
import ColorPicker from './ColorPicker';
import GradientSlider from './GradientSlider';
import GradientDragger from './GradientDragger';

Modal.setAppElement('#root');

interface FillEditorProps {
  fillEditor?: FillEditorState;
  closeFillEditor?(): FillEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
}

const FillEditor = (props: FillEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { fillEditor, closeFillEditor, disableSelectionTool, enableSelectionTool } = props;
  const [fill, setFill] = useState(null);
  const [activePickerColor, setActivePickerColor] = useState(null);
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  const handleCloseRequest = () => {
    if (fillEditor.onClose) {
      fillEditor.onClose(fill);
    }
    closeFillEditor();
  }

  const handleAfterOpen = () => {
    disableSelectionTool();
    setFill(fillEditor.fill);
    switch(fillEditor.fill.fillType) {
      case 'color':
        setActivePickerColor(fillEditor.fill.color);
        break;
      case 'gradient':
        setActivePickerColor(fillEditor.fill.gradient.stops[activeStopIndex].color);
        break;
    }
  }

  const handleAfterClose = () => {
    setActivePickerColor(null);
    setFill(null);
    setActiveStopIndex(0);
    enableSelectionTool();
  }

  const handleActiveColorChange = (color: string) => {
    switch(fill.fillType) {
      case 'color': {
        const newFill = {
          ...fill,
          color
        }
        setFill(newFill);
        if (fillEditor.onChange) {
          fillEditor.onChange(newFill);
        }
        break;
      }
      case 'gradient': {
        const newStops = [...fill.gradient.stops];
        newStops[activeStopIndex].color = color;
        const newFill = {
          ...fill,
          gradient: {
            ...fill.gradient,
            stops: newStops
          }
        }
        setFill(newFill);
        if (fillEditor.onChange) {
          fillEditor.onChange(newFill);
        }
        break;
      }
    }
  }

  const handleGradientChange = (stops: em.GradientStop[]) => {
    const newFill = {
      ...fill,
      gradient: {
        ...fill.gradient,
        stops: stops
      }
    }
    setFill(newFill);
    if (fillEditor.onChange) {
      fillEditor.onChange(newFill);
    }
  }

  const handleGradientPositionChange = (origin: em.Point, destination: em.Point) => {
    const newFill = {
      ...fill,
      gradient: {
        ...fill.gradient,
        origin,
        destination
      }
    }
    setFill(newFill);
    if (fillEditor.onChange) {
      fillEditor.onChange(newFill);
    }
  }

  return (
    <Modal
      className='c-fill-editor'
      overlayClassName='c-fill-editor__overlay'
      isOpen={fillEditor.isOpen}
      onAfterOpen={handleAfterOpen}
      onAfterClose={handleAfterClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleCloseRequest}
      contentLabel='fill-editor'>
      {
        fillEditor.isOpen && fillEditor.fill.fillType === 'gradient' && activePickerColor
        ? <GradientDragger
            layer={fillEditor.layer}
            gradient={fill.gradient}
            onChange={handleGradientPositionChange} />
        : null
      }
      <div
        className='c-fill-editor__picker'
        style={{
          top: fillEditor.y,
          left: fillEditor.x,
          background: theme.background.z1,
          boxShadow: `0 0 0 1px ${theme.background.z4} inset`
        }}>
        {
          fillEditor.isOpen && fillEditor.fill.fillType === 'gradient' && activePickerColor
          ? <GradientSlider
              gradient={fill.gradient}
              activeStopIndex={activeStopIndex}
              setActiveStopIndex={setActiveStopIndex}
              setActivePickerColor={setActivePickerColor}
              onChange={handleGradientChange} />
          : null
        }
        {
          fillEditor.isOpen && activePickerColor
          ? <ColorPicker
              colorValue={activePickerColor}
              colorType='rgb'
              onChange={handleActiveColorChange} />
          : null
        }
      </div>
    </Modal>
  );
}

const mapStateToProps = (state: RootState) => {
  const { fillEditor } = state;
  return { fillEditor };
};

export default connect(
  mapStateToProps,
  { closeFillEditor, disableSelectionTool, enableSelectionTool }
)(FillEditor);