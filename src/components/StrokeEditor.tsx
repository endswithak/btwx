import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeStrokeEditor } from '../store/actions/strokeEditor';
import { StrokeEditorTypes } from '../store/actionTypes/strokeEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { StrokeEditorState } from '../store/reducers/strokeEditor';
import ColorPicker from './ColorPicker';
import GradientSlider from './GradientSlider';
import { SetLayerStrokeFillTypePayload, SetLayerStrokeGradientTypePayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerStrokeFillType, setLayerStrokeGradientType } from '../store/actions/layer';

Modal.setAppElement('#root');

interface StrokeEditorProps {
  strokeEditor?: StrokeEditorState;
  closeStrokeEditor?(): StrokeEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
  setLayerStrokeFillType?(payload: SetLayerStrokeFillTypePayload): LayerTypes;
  setLayerStrokeGradientType?(payload: SetLayerStrokeGradientTypePayload): LayerTypes;
}

const StrokeEditor = (props: StrokeEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { strokeEditor, closeStrokeEditor, disableSelectionTool, enableSelectionTool, setLayerStrokeFillType, setLayerStrokeGradientType } = props;
  const [stroke, setStroke] = useState(null);
  const [activePickerColor, setActivePickerColor] = useState(null);
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  const handleCloseRequest = () => {
    if (strokeEditor.onClose) {
      strokeEditor.onClose(stroke);
    }
    closeStrokeEditor();
  }

  const handleAfterOpen = () => {
    disableSelectionTool();
    setStroke(strokeEditor.stroke);
    switch(strokeEditor.stroke.fillType) {
      case 'color':
        setActivePickerColor(strokeEditor.stroke.color);
        break;
      case 'gradient':
        setActivePickerColor(strokeEditor.stroke.gradient.stops[activeStopIndex].color);
        break;
    }
  }

  const handleAfterClose = () => {
    setActivePickerColor(null);
    setStroke(null);
    setActiveStopIndex(0);
    enableSelectionTool();
  }

  const handleActiveColorChange = (color: string) => {
    switch(stroke.fillType) {
      case 'color': {
        const newStroke = {
          ...stroke,
          color
        }
        setStroke(newStroke);
        if (strokeEditor.onChange) {
          strokeEditor.onChange(newStroke);
        }
        break;
      }
      case 'gradient': {
        const newStops = [...stroke.gradient.stops];
        newStops[activeStopIndex].color = color;
        const newStroke = {
          ...stroke,
          gradient: {
            ...stroke.gradient,
            stops: newStops
          }
        }
        setStroke(newStroke);
        if (strokeEditor.onChange) {
          strokeEditor.onChange(newStroke);
        }
        break;
      }
    }
  }

  const handleGradientChange = (stops: em.GradientStop[]) => {
    const newStroke = {
      ...stroke,
      gradient: {
        ...stroke.gradient,
        stops: stops
      }
    }
    setStroke(newStroke);
    if (strokeEditor.onChange) {
      strokeEditor.onChange(newStroke);
    }
  }

  const handleGradientPositionChange = (origin: em.Point, destination: em.Point) => {
    const newStroke = {
      ...stroke,
      gradient: {
        ...stroke.gradient,
        origin,
        destination
      }
    }
    setStroke(newStroke);
    if (strokeEditor.onChange) {
      strokeEditor.onChange(newStroke);
    }
  }

  const handleColorClick = () => {
    if (stroke.fillType !== 'color') {
      setStroke({
        ...stroke,
        fillType: 'color'
      });
      setLayerStrokeFillType({id: strokeEditor.layer, fillType: 'color'});
      setActivePickerColor(stroke.color);
    }
  }

  const handleLinearGradientClick = () => {
    const newStroke = {...stroke};
    if (stroke.fillType !== 'gradient') {
      newStroke.fillType = 'gradient';
      setLayerStrokeFillType({id: strokeEditor.layer, fillType: 'gradient'});
      setActivePickerColor(stroke.gradient.stops[activeStopIndex].color);
    }
    if (stroke.gradient.gradientType !== 'linear') {
      newStroke.gradient.gradientType = 'linear';
      setLayerStrokeGradientType({id: strokeEditor.layer, gradientType: 'linear'});
    }
    setStroke(newStroke);
  }

  const handleRadialGradientClick = () => {
    const newStroke = {...stroke};
    if (stroke.fillType !== 'gradient') {
      newStroke.fillType = 'gradient';
      setLayerStrokeFillType({id: strokeEditor.layer, fillType: 'gradient'});
      setActivePickerColor(stroke.gradient.stops[activeStopIndex].color);
    }
    if (stroke.gradient.gradientType !== 'radial') {
      newStroke.gradient.gradientType = 'radial';
      setLayerStrokeGradientType({id: strokeEditor.layer, gradientType: 'radial'});
    }
    setStroke(newStroke);
  }

  return (
    <Modal
      className='c-fill-editor'
      overlayClassName='c-fill-editor__overlay'
      isOpen={strokeEditor.isOpen}
      onAfterOpen={handleAfterOpen}
      onAfterClose={handleAfterClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleCloseRequest}
      contentLabel='stroke-editor'>
      {
        strokeEditor.isOpen && stroke && stroke.fillType === 'gradient' && activePickerColor
        ? <GradientDragger
            layer={strokeEditor.layer}
            gradient={stroke.gradient}
            onChange={handleGradientPositionChange} />
        : null
      }
      <div
        className='c-fill-editor__picker'
        style={{
          top: strokeEditor.y,
          left: strokeEditor.x,
          background: theme.background.z1,
          boxShadow: `0 0 0 1px ${theme.background.z4} inset`
        }}>
        {
          strokeEditor.isOpen && activePickerColor
          ? <div
              className='c-fill-editor__type-selector'
              style={{
                boxShadow: `0 -1px 0 0 ${theme.background.z4} inset`
              }}>
              <button
                onClick={handleColorClick}
                className='c-fill-editor__type'
                style={{
                  background: stroke.fillType === 'color'
                  ? theme.palette.primary
                  : theme.background.z6,
                  boxShadow: stroke.fillType === 'color'
                  ? `0 0 0 1px ${theme.palette.primary} inset`
                  : `0 0 0 1px ${theme.background.z6} inset`
                }} />
              <button
                onClick={handleLinearGradientClick}
                className='c-fill-editor__type'
                style={{
                  background: stroke.fillType === 'gradient' && stroke.gradient.gradientType === 'linear'
                  ? `linear-gradient(to top, ${theme.palette.primary}, ${theme.background.z1})`
                  : `linear-gradient(to top, ${theme.background.z6}, ${theme.background.z1})`,
                  boxShadow: stroke.fillType === 'gradient' && stroke.gradient.gradientType === 'linear'
                  ? `0 0 0 1px ${theme.palette.primary} inset`
                  : `0 0 0 1px ${theme.background.z6} inset`
                }} />
              <button
                onClick={handleRadialGradientClick}
                className='c-fill-editor__type'
                style={{
                  background: stroke.fillType === 'gradient' && stroke.gradient.gradientType === 'radial'
                  ? `radial-gradient(${theme.palette.primary}, ${theme.background.z1})`
                  : `radial-gradient(${theme.background.z6}, ${theme.background.z1})`,
                  boxShadow: stroke.fillType === 'gradient' && stroke.gradient.gradientType === 'radial'
                  ? `0 0 0 1px ${theme.palette.primary} inset`
                  : `0 0 0 1px ${theme.background.z6} inset`
                }} />
            </div>
          : null
        }
        {
          strokeEditor.isOpen && activePickerColor
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
  const { strokeEditor } = state;
  return { strokeEditor };
};

export default connect(
  mapStateToProps,
  { closeStrokeEditor, disableSelectionTool, enableSelectionTool, setLayerStrokeFillType, setLayerStrokeGradientType }
)(StrokeEditor);