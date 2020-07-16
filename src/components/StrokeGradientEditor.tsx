/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { openStrokeColorEditor } from '../store/actions/strokeColorEditor';
import { StrokeColorEditorTypes, OpenStrokeColorEditorPayload } from '../store/actionTypes/strokeColorEditor';
import { closeStrokeGradientEditor } from '../store/actions/strokeGradientEditor';
import { StrokeGradientEditorTypes } from '../store/actionTypes/strokeGradientEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { StrokeGradientEditorState } from '../store/reducers/strokeGradientEditor';
import ColorPicker from './ColorPicker';
import GradientSlider from './GradientSlider';
import { SetLayerFillTypePayload, SetLayerStrokeGradientTypePayload, SetLayerStrokeActiveGradientStopPayload, SetLayerStrokeGradientStopColorPayload, SetLayerStrokeGradientStopPositionPayload, AddLayerStrokeGradientStopPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerFillType, setLayerStrokeGradientType, setLayerStrokeGradientStopColor, setLayerStrokeActiveGradientStop, setLayerStrokeGradientStopPosition, addLayerStrokeGradientStop } from '../store/actions/layer';
import FillTypeSelector from './FillTypeSelector';
import debounce from 'lodash.debounce';
import chroma from 'chroma-js';
import { paperMain } from '../canvas';
import GradientFrame from './GradientFrame';

interface StrokeGradientEditorProps {
  stroke?: em.Stroke;
  gradient?: em.Gradient;
  stops?: {
    allIds: string[];
    byId: {
      [id: string]: em.GradientStop;
    };
  };
  strokeGradientEditor?: StrokeGradientEditorState;
  activeStopValue?: em.GradientStop;
  closeStrokeGradientEditor?(): StrokeGradientEditorTypes;
  openStrokeColorEditor?(payload: OpenStrokeColorEditorPayload): StrokeColorEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
  setLayerFillType?(payload: SetLayerFillTypePayload): LayerTypes;
  setLayerStrokeGradientType?(payload: SetLayerStrokeGradientTypePayload): LayerTypes;
  setLayerStrokeGradientStopColor?(payload: SetLayerStrokeGradientStopColorPayload): LayerTypes;
  setLayerStrokeGradientStopPosition?(payload: SetLayerStrokeGradientStopPositionPayload): LayerTypes;
  setLayerStrokeActiveGradientStop?(payload: SetLayerStrokeActiveGradientStopPayload): LayerTypes;
  addLayerStrokeGradientStop?(payload: AddLayerStrokeGradientStopPayload): LayerTypes;
}

const StrokeGradientEditor = (props: StrokeGradientEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { strokeGradientEditor, stroke, gradient, activeStopValue, setLayerFillType, setLayerStrokeGradientType, openStrokeColorEditor, setLayerStrokeGradientStopColor, setLayerStrokeGradientStopPosition, setLayerStrokeActiveGradientStop, addLayerStrokeGradientStop, closeStrokeGradientEditor } = props;
  const debounceStopColorChange = useCallback(
    debounce((stop: string, color: em.Color) => setLayerStrokeGradientStopColor({id: strokeGradientEditor.layer, stop, color}), 150),
    []
  );
  const debounceStopPositionChange = useCallback(
    debounce((stop: string, position: number) => setLayerStrokeGradientStopPosition({id: strokeGradientEditor.layer, stop, position}), 150),
    []
  );

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown, false);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  const onMouseDown = (event: any) => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      if (event.target.id === 'canvas-main') {
        const eventPoint = paperMain.view.getEventPoint(event);
        const hitResult = paperMain.project.hitTest(eventPoint);
        if (!hitResult || hitResult.item.data.id !== 'gradientFrameHandle') {
          closeStrokeGradientEditor();
        }
      } else {
        closeStrokeGradientEditor();
      }
    }
  }

  const handleActiveStopColorChange = (stopColor: em.Color) => {
    debounceStopColorChange(activeStopValue.id, stopColor);
  }

  const handleStopPress = (id: string) => {
    setLayerStrokeActiveGradientStop({id: strokeGradientEditor.layer, stop: id});
  }

  const handleStopDrag = (id: string, position: number) => {
    debounceStopPositionChange(id, position);
  }

  const handleSliderClick = (newStop: em.GradientStop) => {
    addLayerStrokeGradientStop({id: strokeGradientEditor.layer, gradientStop: newStop});
  }

  const handleColorClick = () => {
    setLayerFillType({id: strokeGradientEditor.layer, fillType: 'color'});
    closeStrokeGradientEditor();
    openStrokeColorEditor({
      layer: strokeGradientEditor.layer,
      color: stroke.color,
      x: strokeGradientEditor.x,
      y: strokeGradientEditor.y
    });
  }

  const handleLinearGradientClick = () => {
    if (gradient.gradientType !== 'linear') {
      setLayerStrokeGradientType({id: strokeGradientEditor.layer, gradientType: 'linear'});
    }
  }

  const handleRadialGradientClick = () => {
    if (gradient.gradientType !== 'radial') {
      setLayerStrokeGradientType({id: strokeGradientEditor.layer, gradientType: 'radial'});
    }
  }

  return (
    <div
      ref={editorRef}
      className='c-fill-editor'>
      <div
        className='c-fill-editor__picker'
        style={{
          top: strokeGradientEditor.y,
          background: chroma(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).alpha(0.88).hex(),
          boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
        }}>
        <FillTypeSelector
          colorSelector={{
            enabled: true,
            onClick: handleColorClick,
            isActive: false
          }}
          linearGradientSelector={{
            enabled: true,
            onClick: handleLinearGradientClick,
            isActive: gradient.gradientType === 'linear'
          }}
          radialGradientSelector={{
            enabled: true,
            onClick: handleRadialGradientClick,
            isActive: gradient.gradientType === 'radial'
          }} />
        <GradientSlider
          gradientStops={gradient.stops}
          onStopPress={handleStopPress}
          onStopDrag={handleStopDrag}
          onSliderClick={handleSliderClick}
        />
        <ColorPicker
          colorValue={activeStopValue.color}
          colorType='rgb'
          onChange={handleActiveStopColorChange} />
        <GradientFrame
          layer={strokeGradientEditor.layer}
          gradient={gradient}
          onStopPress={handleStopPress} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { strokeGradientEditor, layer } = state;
  const layerItem = layer.present.byId[strokeGradientEditor.layer];
  const stroke = layerItem.style.stroke;
  const gradient = stroke.gradient;
  const stops = gradient.stops;
  const activeStopId = stops.allIds.find((stop) => stops.byId[stop].active);
  const activeStopValue = stops.byId[activeStopId];
  return { strokeGradientEditor: strokeGradientEditor, layerItem, stroke, gradient, activeStopValue };
};

export default connect(
  mapStateToProps,
  {
    closeStrokeGradientEditor,
    disableSelectionTool,
    enableSelectionTool,
    setLayerFillType,
    setLayerStrokeGradientType,
    openStrokeColorEditor,
    setLayerStrokeGradientStopColor,
    setLayerStrokeGradientStopPosition,
    setLayerStrokeActiveGradientStop,
    addLayerStrokeGradientStop
  }
)(StrokeGradientEditor);