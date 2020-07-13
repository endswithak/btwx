/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { openFillColorEditor } from '../store/actions/fillColorEditor';
import { FillColorEditorTypes, OpenFillColorEditorPayload } from '../store/actionTypes/fillColorEditor';
import { openFillLinearGradientEditor } from '../store/actions/fillLinearGradientEditor';
import { FillLinearGradientEditorTypes, OpenFillLinearGradientEditorPayload } from '../store/actionTypes/fillLinearGradientEditor';
import { closeFillRadialGradientEditor } from '../store/actions/fillRadialGradientEditor';
import { FillRadialGradientEditorTypes } from '../store/actionTypes/fillRadialGradientEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { FillRadialGradientEditorState } from '../store/reducers/fillRadialGradientEditor';
import ColorPicker from './ColorPicker';
import GradientSlider from './GradientSlider';
import { SetLayerFillTypePayload, SetLayerFillGradientTypePayload, SetLayerFillGradientStopColorPayload, SetLayerFillGradientStopPositionPayload, SetLayerFillActiveGradientStopPayload, AddLayerFillGradientStopPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerFill, setLayerFillType, setLayerFillGradientType, setLayerFillGradientStopColor, setLayerFillGradientStopPosition, setLayerFillActiveGradientStop, addLayerFillGradientStop } from '../store/actions/layer';
import FillTypeSelector from './FillTypeSelector';
import debounce from 'lodash.debounce';
import chroma from 'chroma-js';

interface FillRadialGradientEditorProps {
  fill?: em.Fill;
  gradient?: em.Gradient;
  stops?: {
    allIds: string[];
    byId: {
      [id: string]: em.GradientStop;
    };
  };
  fillRadialGradientEditor?: FillRadialGradientEditorState;
  activeStopValue?: em.GradientStop;
  closeFillRadialGradientEditor?(): FillRadialGradientEditorTypes;
  openFillLinearGradientEditor?(payload: OpenFillLinearGradientEditorPayload): FillLinearGradientEditorTypes;
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

const FillRadialGradientEditor = (props: FillRadialGradientEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { fill, gradient, activeStopValue, fillRadialGradientEditor, openFillLinearGradientEditor, closeFillRadialGradientEditor, disableSelectionTool, enableSelectionTool, setLayerFillType, setLayerFillGradientStopColor, setLayerFillGradientType, setLayerFillGradientStopPosition, openFillColorEditor, setLayerFillActiveGradientStop, addLayerFillGradientStop } = props;
  const [prevActiveStopId, setPrevActiveStopId] = useState(activeStopValue.id);
  const debounceStopColorChange = useCallback(
    debounce((stop: string, color: string) => setLayerFillGradientStopColor({id: fillRadialGradientEditor.layer, stop, color}), 150),
    []
  );
  const debounceStopPositionChange = useCallback(
    debounce((stop: string, position: number) => setLayerFillGradientStopPosition({id: fillRadialGradientEditor.layer, stop, position}), 150),
    []
  );

  useEffect(() => {
    onOpen();
    return () => {
      onClose();
    }
  }, []);

  const onOpen = () => {
    //disableSelectionTool();
    document.addEventListener('mousedown', onMouseDown, false);
  }

  const onClose = () => {
    //enableSelectionTool();
    document.removeEventListener('mousedown', onMouseDown);
  }

  const onMouseDown = (event: any) => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      closeFillRadialGradientEditor();
    }
  }

  const handleActiveStopColorChange = (stopColor: string) => {
    if (activeStopValue.id === prevActiveStopId) {
      debounceStopColorChange(activeStopValue.id, stopColor);
    } else {
      setPrevActiveStopId(activeStopValue.id);
    }
  }

  const handleStopPress = (id: string) => {
    setLayerFillActiveGradientStop({id: fillRadialGradientEditor.layer, stop: id});
  }

  const handleStopDrag = (id: string, position: number) => {
    debounceStopPositionChange(id, position);
  }

  const handleSliderClick = (newStop: em.GradientStop) => {
    addLayerFillGradientStop({id: fillRadialGradientEditor.layer, gradientStop: newStop});
  }

  const handleColorClick = () => {
    setLayerFillType({id: fillRadialGradientEditor.layer, fillType: 'color'});
    closeFillRadialGradientEditor();
    openFillColorEditor({
      layer: fillRadialGradientEditor.layer,
      color: fill.color,
      x: fillRadialGradientEditor.x,
      y: fillRadialGradientEditor.y
    });
  }

  const handleLinearGradientClick = () => {
    setLayerFillGradientType({id: fillRadialGradientEditor.layer, gradientType: 'linear'});
    closeFillRadialGradientEditor();
    openFillLinearGradientEditor({
      layer: fillRadialGradientEditor.layer,
      gradient: {
        ...gradient,
        gradientType: 'linear'
      },
      x: fillRadialGradientEditor.x,
      y: fillRadialGradientEditor.y
    });
  }

  return (
    <div
      ref={editorRef}
      className='c-fill-editor'>
      <div
        className='c-fill-editor__picker'
        style={{
          top: fillRadialGradientEditor.y,
          //transform: `translate(8px, ${fillEditor.y}px)`,
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
            isActive: false
          }}
          radialGradientSelector={{
            enabled: true,
            onClick: () => {return;},
            isActive: true
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
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { fillRadialGradientEditor, layer } = state;
  const layerItem = layer.present.byId[fillRadialGradientEditor.layer];
  const fill = layerItem.style.fill;
  const gradient = fill.gradient;
  const stops = gradient.stops;
  const activeStopId = stops.allIds.find((stop) => stops.byId[stop].active);
  const activeStopValue = stops.byId[activeStopId];
  return { fillRadialGradientEditor, layerItem, fill, gradient, activeStopValue };
};

export default connect(
  mapStateToProps,
  {
    openFillLinearGradientEditor,
    closeFillRadialGradientEditor,
    disableSelectionTool,
    enableSelectionTool,
    setLayerFillType,
    setLayerFillGradientType,
    setLayerFill,
    openFillColorEditor,
    setLayerFillGradientStopColor,
    setLayerFillGradientStopPosition,
    setLayerFillActiveGradientStop,
    addLayerFillGradientStop
  }
)(FillRadialGradientEditor);