/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { openFillColorEditor } from '../store/actions/fillColorEditor';
import { FillColorEditorTypes, OpenFillColorEditorPayload } from '../store/actionTypes/fillColorEditor';
import { closeFillGradientEditor } from '../store/actions/fillGradientEditor';
import { FillGradientEditorTypes } from '../store/actionTypes/fillGradientEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { FillGradientEditorState } from '../store/reducers/fillGradientEditor';
import ColorPicker from './ColorPicker';
import GradientSlider from './GradientSlider';
import { SetLayerFillTypePayload, SetLayerFillGradientTypePayload, SetLayerFillActiveGradientStopPayload, SetLayerFillGradientStopColorPayload, SetLayerFillGradientStopPositionPayload, AddLayerFillGradientStopPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerFillType, setLayerFillGradientType, setLayerFillGradientStopColor, setLayerFillActiveGradientStop, setLayerFillGradientStopPosition, addLayerFillGradientStop } from '../store/actions/layer';
import FillTypeSelector from './FillTypeSelector';
import debounce from 'lodash.debounce';
import chroma from 'chroma-js';
import { paperMain } from '../canvas';
import GradientFrame from './GradientFrame';

interface FillGradientEditorProps {
  fill?: em.Fill;
  gradient?: em.Gradient;
  stops?: {
    allIds: string[];
    byId: {
      [id: string]: em.GradientStop;
    };
  };
  fillGradientEditor?: FillGradientEditorState;
  activeStopValue?: em.GradientStop;
  closeFillGradientEditor?(): FillGradientEditorTypes;
  openFillColorEditor?(payload: OpenFillColorEditorPayload): FillColorEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
  setLayerFillType?(payload: SetLayerFillTypePayload): LayerTypes;
  setLayerFillGradientType?(payload: SetLayerFillGradientTypePayload): LayerTypes;
  setLayerFillGradientStopColor?(payload: SetLayerFillGradientStopColorPayload): LayerTypes;
  setLayerFillGradientStopPosition?(payload: SetLayerFillGradientStopPositionPayload): LayerTypes;
  setLayerFillActiveGradientStop?(payload: SetLayerFillActiveGradientStopPayload): LayerTypes;
  addLayerFillGradientStop?(payload: AddLayerFillGradientStopPayload): LayerTypes;
}

const FillGradientEditor = (props: FillGradientEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { fillGradientEditor, fill, gradient, activeStopValue, setLayerFillType, setLayerFillGradientType, openFillColorEditor, setLayerFillGradientStopColor, setLayerFillGradientStopPosition, setLayerFillActiveGradientStop, addLayerFillGradientStop, closeFillGradientEditor } = props;
  const debounceStopColorChange = useCallback(
    debounce((stop: string, color: em.Color) => setLayerFillGradientStopColor({id: fillGradientEditor.layer, stop, color}), 150),
    []
  );
  const debounceStopPositionChange = useCallback(
    debounce((stop: string, position: number) => setLayerFillGradientStopPosition({id: fillGradientEditor.layer, stop, position}), 150),
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
          closeFillGradientEditor();
        }
      } else {
        closeFillGradientEditor();
      }
    }
  }

  const handleActiveStopColorChange = (stopColor: em.Color) => {
    debounceStopColorChange(activeStopValue.id, stopColor);
  }

  const handleStopPress = (id: string) => {
    setLayerFillActiveGradientStop({id: fillGradientEditor.layer, stop: id});
  }

  const handleStopDrag = (id: string, position: number) => {
    debounceStopPositionChange(id, position);
  }

  const handleSliderClick = (newStop: em.GradientStop) => {
    addLayerFillGradientStop({id: fillGradientEditor.layer, gradientStop: newStop});
  }

  const handleColorClick = () => {
    setLayerFillType({id: fillGradientEditor.layer, fillType: 'color'});
    closeFillGradientEditor();
    openFillColorEditor({
      layer: fillGradientEditor.layer,
      color: fill.color,
      x: fillGradientEditor.x,
      y: fillGradientEditor.y
    });
  }

  const handleLinearGradientClick = () => {
    if (gradient.gradientType !== 'linear') {
      setLayerFillGradientType({id: fillGradientEditor.layer, gradientType: 'linear'});
    }
  }

  const handleRadialGradientClick = () => {
    if (gradient.gradientType !== 'radial') {
      setLayerFillGradientType({id: fillGradientEditor.layer, gradientType: 'radial'});
    }
  }

  return (
    <div
      ref={editorRef}
      className='c-fill-editor'>
      <div
        className='c-fill-editor__picker'
        style={{
          top: fillGradientEditor.y,
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
          layer={fillGradientEditor.layer}
          gradient={gradient}
          onStopPress={handleStopPress} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { fillGradientEditor, layer } = state;
  const layerItem = layer.present.byId[fillGradientEditor.layer];
  const fill = layerItem.style.fill;
  const gradient = fill.gradient;
  const stops = gradient.stops;
  const activeStopId = stops.allIds.find((stop) => stops.byId[stop].active);
  const activeStopValue = stops.byId[activeStopId];
  return { fillGradientEditor: fillGradientEditor, layerItem, fill, gradient, activeStopValue };
};

export default connect(
  mapStateToProps,
  {
    closeFillGradientEditor,
    disableSelectionTool,
    enableSelectionTool,
    setLayerFillType,
    setLayerFillGradientType,
    openFillColorEditor,
    setLayerFillGradientStopColor,
    setLayerFillGradientStopPosition,
    setLayerFillActiveGradientStop,
    addLayerFillGradientStop
  }
)(FillGradientEditor);