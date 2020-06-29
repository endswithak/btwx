/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
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
import { SetLayerFillTypePayload, SetLayerFillGradientTypePayload, SetLayerFillGradientPayload, SetLayerFillColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerFillType, setLayerFillGradientType, setLayerFillGradient, setLayerFillColor } from '../store/actions/layer';
import FillTypeSelector from './FillTypeSelector';

interface FillEditorProps {
  fillEditor?: FillEditorState;
  closeFillEditor?(): FillEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
  setLayerFillColor?(payload: SetLayerFillColorPayload): LayerTypes;
  setLayerFillGradient?(payload: SetLayerFillGradientPayload): LayerTypes;
  setLayerFillType?(payload: SetLayerFillTypePayload): LayerTypes;
  setLayerFillGradientType?(payload: SetLayerFillGradientTypePayload): LayerTypes;
}

const FillEditor = (props: FillEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { fillEditor, closeFillEditor, disableSelectionTool, enableSelectionTool, setLayerFillType, setLayerFillColor, setLayerFillGradient, setLayerFillGradientType } = props;
  const [fill, setFill] = useState(fillEditor.fill);
  const [activePickerColor, setActivePickerColor] = useState(() => {
    switch(fillEditor.fill.fillType) {
      case 'color':
        return fillEditor.fill.color;
      case 'gradient':
        return fillEditor.fill.gradient.stops[0].color;
    }
  });
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  useEffect(() => {
    onOpen();
    return () => {
      onClose();
    }
  }, []);

  const onOpen = () => {
    disableSelectionTool();
    document.addEventListener('mousedown', onMouseDown, false);
  }

  const onClose = () => {
    enableSelectionTool();
    document.removeEventListener('mousedown', onMouseDown);
  }

  const onMouseDown = (event: any) => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      closeFillEditor();
    }
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

  const handleActiveColorChangeDebounce = (color: string) => {
    switch(fill.fillType) {
      case 'color': {
        setLayerFillColor({id: fillEditor.layer, fillColor: color});
        break;
      }
      case 'gradient':
        setLayerFillGradient({id: fillEditor.layer, gradient: fill.gradient});
        break;
    }
  }

  const handleGradientChange = (gradient: em.Gradient) => {
    const newFill = {
      ...fill,
      gradient
    }
    setFill(newFill);
    if (fillEditor.onChange) {
      fillEditor.onChange(newFill);
    }
  }

  const handleGradientChangeDebounce = (gradient: em.Gradient) => {
    setLayerFillGradient({id: fillEditor.layer, gradient: gradient});
  }

  const handleColorClick = () => {
    if (fill.fillType !== 'color') {
      setFill({
        ...fill,
        fillType: 'color'
      });
      setLayerFillType({id: fillEditor.layer, fillType: 'color'});
      setActivePickerColor(fill.color);
    }
  }

  const handleLinearGradientClick = () => {
    const newFill = {...fill};
    if (fill.fillType !== 'gradient') {
      newFill.fillType = 'gradient';
      setLayerFillType({id: fillEditor.layer, fillType: 'gradient'});
      setActivePickerColor(fill.gradient.stops[activeStopIndex].color);
    }
    if (fill.gradient.gradientType !== 'linear') {
      newFill.gradient.gradientType = 'linear';
      setLayerFillGradientType({id: fillEditor.layer, gradientType: 'linear'});
    }
    setFill(newFill);
  }

  const handleRadialGradientClick = () => {
    const newFill = {...fill};
    if (fill.fillType !== 'gradient') {
      newFill.fillType = 'gradient';
      setLayerFillType({id: fillEditor.layer, fillType: 'gradient'});
      setActivePickerColor(fill.gradient.stops[activeStopIndex].color);
    }
    if (fill.gradient.gradientType !== 'radial') {
      newFill.gradient.gradientType = 'radial';
      setLayerFillGradientType({id: fillEditor.layer, gradientType: 'radial'});
    }
    setFill(newFill);
  }

  return (
    <div
      ref={editorRef}
      className='c-fill-editor'>
      <div
        className='c-fill-editor__picker'
        style={{
          top: fillEditor.y,
          left: fillEditor.x,
          background: theme.background.z1,
          boxShadow: `0 0 0 1px ${theme.background.z4} inset`
        }}>
        <FillTypeSelector
          colorSelector={{
            enabled: true,
            onClick: handleColorClick,
            isActive: fill.fillType === 'color'
          }}
          linearGradientSelector={{
            enabled: true,
            onClick: handleLinearGradientClick,
            isActive: fill.fillType === 'gradient' && fill.gradient.gradientType === 'linear'
          }}
          radialGradientSelector={{
            enabled: true,
            onClick: handleRadialGradientClick,
            isActive: fill.fillType === 'gradient' && fill.gradient.gradientType === 'radial'
          }} />
        {
          fill.fillType === 'gradient'
          ? <GradientSlider
              gradientValue={fill.gradient}
              activeStopIndex={activeStopIndex}
              setActiveStopIndex={setActiveStopIndex}
              setActivePickerColor={setActivePickerColor}
              onChange={handleGradientChange}
              onChangeDebounce={handleGradientChangeDebounce} />
          : null
        }
        <ColorPicker
          colorValue={activePickerColor}
          colorType='rgb'
          onChange={handleActiveColorChange}
          onChangeDebounce={handleActiveColorChangeDebounce} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { fillEditor } = state;
  return { fillEditor };
};

export default connect(
  mapStateToProps,
  { closeFillEditor, disableSelectionTool, enableSelectionTool, setLayerFillType, setLayerFillGradientType, setLayerFillGradient, setLayerFillColor }
)(FillEditor);