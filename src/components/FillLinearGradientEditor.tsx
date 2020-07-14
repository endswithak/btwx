/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { openFillColorEditor } from '../store/actions/fillColorEditor';
import { FillColorEditorTypes, OpenFillColorEditorPayload } from '../store/actionTypes/fillColorEditor';
import { openFillRadialGradientEditor } from '../store/actions/fillRadialGradientEditor';
import { FillRadialGradientEditorTypes, OpenFillRadialGradientEditorPayload } from '../store/actionTypes/fillRadialGradientEditor';
import { closeFillLinearGradientEditor } from '../store/actions/fillLinearGradientEditor';
import { FillLinearGradientEditorTypes } from '../store/actionTypes/fillLinearGradientEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { FillLinearGradientEditorState } from '../store/reducers/fillLinearGradientEditor';
import ColorPicker from './ColorPicker';
import GradientSlider from './GradientSlider';
import { SetLayerFillTypePayload, SetLayerFillGradientTypePayload, SetLayerFillActiveGradientStopPayload, SetLayerFillGradientStopColorPayload, SetLayerFillGradientStopPositionPayload, AddLayerFillGradientStopPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerFillType, setLayerFillGradientType, setLayerFillGradientStopColor, setLayerFillActiveGradientStop, setLayerFillGradientStopPosition, addLayerFillGradientStop } from '../store/actions/layer';
import FillTypeSelector from './FillTypeSelector';
import debounce from 'lodash.debounce';
import chroma from 'chroma-js';
import { paperMain } from '../canvas';
import GradientFrame from './GradientFrame';

interface FillLinearGradientEditorProps {
  fill?: em.Fill;
  gradient?: em.Gradient;
  stops?: {
    allIds: string[];
    byId: {
      [id: string]: em.GradientStop;
    };
  };
  fillLinearGradientEditor?: FillLinearGradientEditorState;
  activeStopValue?: em.GradientStop;
  closeFillLinearGradientEditor?(): FillLinearGradientEditorTypes;
  openFillRadialGradientEditor?(payload: OpenFillRadialGradientEditorPayload): FillRadialGradientEditorTypes;
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

const FillLinearGradientEditor = (props: FillLinearGradientEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { fill, gradient, fillLinearGradientEditor, activeStopValue, openFillRadialGradientEditor, closeFillLinearGradientEditor, disableSelectionTool, enableSelectionTool, setLayerFillType, setLayerFillGradientType, openFillColorEditor, setLayerFillGradientStopColor, setLayerFillGradientStopPosition, setLayerFillActiveGradientStop, addLayerFillGradientStop } = props;
  const [prevActiveStopId, setPrevActiveStopId] = useState(activeStopValue.id);
  const debounceStopColorChange = useCallback(
    debounce((stop: string, color: string) => setLayerFillGradientStopColor({id: fillLinearGradientEditor.layer, stop, color}), 150),
    []
  );
  const debounceStopPositionChange = useCallback(
    debounce((stop: string, position: number) => setLayerFillGradientStopPosition({id: fillLinearGradientEditor.layer, stop, position}), 150),
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
          closeFillLinearGradientEditor();
        }
      } else {
        closeFillLinearGradientEditor();
      }
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
    setLayerFillActiveGradientStop({id: fillLinearGradientEditor.layer, stop: id});
  }

  const handleStopDrag = (id: string, position: number) => {
    debounceStopPositionChange(id, position);
  }

  const handleSliderClick = (newStop: em.GradientStop) => {
    addLayerFillGradientStop({id: fillLinearGradientEditor.layer, gradientStop: newStop});
  }

  const handleColorClick = () => {
    setLayerFillType({id: fillLinearGradientEditor.layer, fillType: 'color'});
    closeFillLinearGradientEditor();
    openFillColorEditor({
      layer: fillLinearGradientEditor.layer,
      color: fill.color,
      x: fillLinearGradientEditor.x,
      y: fillLinearGradientEditor.y
    });
  }

  const handleRadialGradientClick = () => {
    setLayerFillGradientType({id: fillLinearGradientEditor.layer, gradientType: 'radial'});
    closeFillLinearGradientEditor();
    openFillRadialGradientEditor({
      layer: fillLinearGradientEditor.layer,
      gradient: {
        ...gradient,
        gradientType: 'radial'
      },
      x: fillLinearGradientEditor.x,
      y: fillLinearGradientEditor.y
    });
  }

  return (
    <div
      ref={editorRef}
      className='c-fill-editor'>
      <div
        className='c-fill-editor__picker'
        style={{
          top: fillLinearGradientEditor.y,
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
            onClick: () => {return;},
            isActive: true
          }}
          radialGradientSelector={{
            enabled: true,
            onClick: handleRadialGradientClick,
            isActive: false
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
          layer={fillLinearGradientEditor.layer}
          gradient={gradient}
          onStopPress={handleStopPress} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { fillLinearGradientEditor, layer } = state;
  const layerItem = layer.present.byId[fillLinearGradientEditor.layer];
  const fill = layerItem.style.fill;
  const gradient = fill.gradient;
  const stops = gradient.stops;
  const activeStopId = stops.allIds.find((stop) => stops.byId[stop].active);
  const activeStopValue = stops.byId[activeStopId];
  return { fillLinearGradientEditor: fillLinearGradientEditor, layerItem, fill, gradient, activeStopValue };
};

export default connect(
  mapStateToProps,
  {
    openFillRadialGradientEditor,
    closeFillLinearGradientEditor,
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
)(FillLinearGradientEditor);