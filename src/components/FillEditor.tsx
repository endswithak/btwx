/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect, useCallback } from 'react';
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
import { SetLayerFillTypePayload, SetLayerFillGradientTypePayload, SetLayerFillGradientPayload, SetLayerFillColorPayload, SetLayerFillPayload ,LayerTypes } from '../store/actionTypes/layer';
import { setLayerFill, setLayerFillType, setLayerFillGradientType, setLayerFillGradient, setLayerFillColor } from '../store/actions/layer';
import { compareFills } from '../store/selectors/layer';
import FillTypeSelector from './FillTypeSelector';
import useDebounce from './useDebounce';
import debounce from 'lodash.debounce';

interface FillEditorProps {
  fillEditor?: FillEditorState;
  closeFillEditor?(): FillEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
  setLayerFillColor?(payload: SetLayerFillColorPayload): LayerTypes;
  setLayerFillGradient?(payload: SetLayerFillGradientPayload): LayerTypes;
  setLayerFillType?(payload: SetLayerFillTypePayload): LayerTypes;
  setLayerFillGradientType?(payload: SetLayerFillGradientTypePayload): LayerTypes;
  setLayerFill?(payload: SetLayerFillPayload): LayerTypes;
}

const FillEditor = (props: FillEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { fillEditor, closeFillEditor, disableSelectionTool, enableSelectionTool, setLayerFillType, setLayerFillColor, setLayerFillGradient, setLayerFillGradientType, setLayerFill } = props;
  const [fill, setFill] = useState(fillEditor.fill);
  const [prevFill, setPrevFill] = useState(fillEditor.fill);
  const debounceFill = useCallback(
    debounce((dfill: em.Fill) => setLayerFill({id: fillEditor.layer, fill: dfill}), 250),
    []
  );
  const [activePickerColor, setActivePickerColor] = useState(() => {
    switch(fillEditor.fill.fillType) {
      case 'color':
        return fillEditor.fill.color;
      case 'gradient':
        return fillEditor.fill.gradient.stops[0].color;
    }
  });
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [activeStopColor, setActiveStopColor] = useState(fillEditor.fill.gradient.stops[0].color);

  useEffect(() => {
    onOpen();
    return () => {
      onClose();
    }
  }, []);

  useEffect(() => {
    if (!compareFills(fill, prevFill)) {
      if (fillEditor.onChange) {
        fillEditor.onChange(fill);
      }
      setPrevFill(fill);
      debounceFill(fill);
    }
  }, [fill]);

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
        setFill({
          ...fill,
          color
        });
        break;
      }
      case 'gradient': {
        setActiveStopColor(color);
        break;
      }
    }
  }

  const handleGradientChange = (gradient: em.Gradient) => {
    const newFill = {
      ...fill,
      gradient
    }
    setFill(newFill);
  }

  const handleColorClick = () => {
    if (fill.fillType !== 'color') {
      setFill({
        ...fill,
        fillType: 'color'
      });
      setActivePickerColor(fill.color);
    }
  }

  const handleLinearGradientClick = () => {
    const newFill = {...fill};
    if (fill.fillType !== 'gradient') {
      newFill.fillType = 'gradient';
      setActivePickerColor(fill.gradient.stops[activeStopIndex].color);
    }
    if (fill.gradient.gradientType !== 'linear') {
      newFill.gradient.gradientType = 'linear';
    }
    setFill(newFill);
  }

  const handleRadialGradientClick = () => {
    const newFill = {...fill};
    if (fill.fillType !== 'gradient') {
      newFill.fillType = 'gradient';
      setActivePickerColor(fill.gradient.stops[activeStopIndex].color);
    }
    if (fill.gradient.gradientType !== 'radial') {
      newFill.gradient.gradientType = 'radial';
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
              activeStopColor={activeStopColor}
              activeStopIndex={activeStopIndex}
              setActiveStopIndex={setActiveStopIndex}
              setActivePickerColor={setActivePickerColor}
              onChange={handleGradientChange} />
          : null
        }
        <ColorPicker
          colorValue={activePickerColor}
          colorType='rgb'
          onChange={handleActiveColorChange} />
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
  { closeFillEditor, disableSelectionTool, enableSelectionTool, setLayerFillType, setLayerFillGradientType, setLayerFillGradient, setLayerFillColor, setLayerFill }
)(FillEditor);