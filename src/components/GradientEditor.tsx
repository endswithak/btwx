/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getPaperLayer, getGradientStops, getGradientOriginPoint, getGradientDestinationPoint } from '../store/selectors/layer';
import { openColorEditor } from '../store/actions/colorEditor';
import { ColorEditorTypes, OpenColorEditorPayload } from '../store/actionTypes/colorEditor';
import { closeGradientEditor } from '../store/actions/gradientEditor';
import { GradientEditorTypes } from '../store/actionTypes/gradientEditor';
import { GradientEditorState } from '../store/reducers/gradientEditor';
import ColorPicker from './ColorPicker';
import GradientSlider from './GradientSlider';
import { SetLayerFillTypePayload, SetLayerFillGradientTypePayload, SetLayerFillActiveGradientStopPayload, SetLayerFillGradientStopColorPayload, SetLayerFillGradientStopPositionPayload, AddLayerFillGradientStopPayload, SetLayerStrokeGradientTypePayload, SetLayerStrokeActiveGradientStopPayload, SetLayerStrokeGradientStopColorPayload, SetLayerStrokeGradientStopPositionPayload, AddLayerStrokeGradientStopPayload, SetLayerStrokeFillTypePayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerFillType, setLayerFillGradientType, setLayerFillGradientStopColor, setLayerFillActiveGradientStop, setLayerFillGradientStopPosition, addLayerFillGradientStop, setLayerStrokeGradientType, setLayerStrokeGradientStopColor, setLayerStrokeActiveGradientStop, setLayerStrokeGradientStopPosition, addLayerStrokeGradientStop, setLayerStrokeFillType } from '../store/actions/layer';
import FillTypeSelector from './FillTypeSelector';
import { paperMain } from '../canvas';
import GradientFrame from './GradientFrame';

interface GradientEditorProps {
  style?: em.Fill | em.Stroke;
  gradient?: em.Gradient;
  gradientEditor?: GradientEditorState;
  activeStopValue?: em.GradientStop;
  closeGradientEditor?(): GradientEditorTypes;
  openColorEditor?(payload: OpenColorEditorPayload): ColorEditorTypes;
  setLayerFillType?(payload: SetLayerFillTypePayload): LayerTypes;
  setLayerFillGradientType?(payload: SetLayerFillGradientTypePayload): LayerTypes;
  setLayerFillGradientStopColor?(payload: SetLayerFillGradientStopColorPayload): LayerTypes;
  setLayerFillGradientStopPosition?(payload: SetLayerFillGradientStopPositionPayload): LayerTypes;
  setLayerFillActiveGradientStop?(payload: SetLayerFillActiveGradientStopPayload): LayerTypes;
  addLayerFillGradientStop?(payload: AddLayerFillGradientStopPayload): LayerTypes;
  setLayerStrokeGradientType?(payload: SetLayerStrokeGradientTypePayload): LayerTypes;
  setLayerStrokeGradientStopColor?(payload: SetLayerStrokeGradientStopColorPayload): LayerTypes;
  setLayerStrokeGradientStopPosition?(payload: SetLayerStrokeGradientStopPositionPayload): LayerTypes;
  setLayerStrokeActiveGradientStop?(payload: SetLayerStrokeActiveGradientStopPayload): LayerTypes;
  addLayerStrokeGradientStop?(payload: AddLayerStrokeGradientStopPayload): LayerTypes;
  setLayerStrokeFillType?(payload: SetLayerStrokeFillTypePayload): LayerTypes;
}

const GradientEditor = (props: GradientEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { gradientEditor, style, gradient, activeStopValue, setLayerStrokeActiveGradientStop, setLayerStrokeGradientType, setLayerStrokeGradientStopColor, setLayerStrokeGradientStopPosition, setLayerFillType, setLayerFillGradientType, openColorEditor, setLayerFillGradientStopColor, setLayerFillGradientStopPosition, setLayerFillActiveGradientStop, addLayerFillGradientStop, closeGradientEditor, addLayerStrokeGradientStop, setLayerStrokeFillType } = props;

  const debounceStopColorChange = useCallback(
    debounce((stop: string, color: em.Color) => {
      switch(gradientEditor.prop) {
        case 'fill':
          setLayerFillGradientStopColor({id: gradientEditor.layer, stop, color});
          break;
        case 'stroke':
          setLayerStrokeGradientStopColor({id: gradientEditor.layer, stop, color});
          break;
      }
    }, 150),
    []
  );

  const debounceStopPositionChange = useCallback(
    debounce((stop: string, position: number) => {
      switch(gradientEditor.prop) {
        case 'fill':
          setLayerFillGradientStopPosition({id: gradientEditor.layer, stop, position});
          break;
        case 'stroke':
          setLayerStrokeGradientStopPosition({id: gradientEditor.layer, stop, position});
          break;
      }
    }, 150),
    []
  );

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown, false);
    return (): void => {
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  const onMouseDown = (event: any): void => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      if (event.target.id === 'canvas') {
        const eventPoint = paperMain.view.getEventPoint(event);
        const hitResult = paperMain.project.hitTest(eventPoint);
        if (!hitResult || hitResult.item.data.id !== 'gradientFrameHandle') {
          closeGradientEditor();
        }
      } else {
        closeGradientEditor();
      }
    }
  }

  const handleActiveStopColorChange = (stopColor: em.Color): void => {
    // const paperLayer = getPaperLayer(gradientEditor.layer);
    // const newStopsById = Object.keys(gradient.stops.byId).reduce((result: { [id: string]: em.GradientStop }, current) => {
    //   if (current === activeStopValue.id) {
    //     result[current] = {
    //       ...gradient.stops.byId[current],
    //       color: stopColor
    //     }
    //   } else {
    //     result[current] = gradient.stops.byId[current];
    //   }
    //   return result;
    // }, {});
    // switch(gradientEditor.prop) {
    //   case 'fill': {
    //     paperLayer.fillColor = {
    //       gradient: {
    //         stops: getGradientStops(newStopsById),
    //         radial: gradient.gradientType === 'radial'
    //       },
    //       origin: getGradientOriginPoint(gradientEditor.layer, gradient.origin),
    //       destination: getGradientDestinationPoint(gradientEditor.layer, gradient.destination)
    //     } as any
    //     break;
    //   }
    //   case 'stroke':
    //     paperLayer.strokeColor = {
    //       gradient: {
    //         stops: getGradientStops(newStopsById),
    //         radial: gradient.gradientType === 'radial'
    //       },
    //       origin: getGradientOriginPoint(gradientEditor.layer, gradient.origin),
    //       destination: getGradientDestinationPoint(gradientEditor.layer, gradient.destination)
    //     } as any
    //     break;
    // }
    debounceStopColorChange(activeStopValue.id, stopColor);
  }

  const handleStopPress = (id: string): void => {
    switch(gradientEditor.prop) {
      case 'fill':
        setLayerFillActiveGradientStop({id: gradientEditor.layer, stop: id});
        break;
      case 'stroke':
        setLayerStrokeActiveGradientStop({id: gradientEditor.layer, stop: id});
        break;
    }
  }

  const handleStopDrag = (id: string, position: number): void => {
    debounceStopPositionChange(id, position);
  }

  const handleSliderClick = (newStop: em.GradientStop): void => {
    switch(gradientEditor.prop) {
      case 'fill':
        addLayerFillGradientStop({id: gradientEditor.layer, gradientStop: newStop});
        break;
      case 'stroke':
        addLayerStrokeGradientStop({id: gradientEditor.layer, gradientStop: newStop});
        break;
    }
  }

  const handleColorClick = (): void => {
    switch(gradientEditor.prop) {
      case 'fill':
        setLayerFillType({id: gradientEditor.layer, fillType: 'color'});
        break;
      case 'stroke':
        setLayerStrokeFillType({id: gradientEditor.layer, fillType: 'color'});
        break;
    }
    closeGradientEditor();
    openColorEditor({
      layer: gradientEditor.layer,
      prop: gradientEditor.prop,
      color: style.color,
      x: gradientEditor.x,
      y: gradientEditor.y
    });
  }

  const handleLinearGradientClick = (): void => {
    if (gradient.gradientType !== 'linear') {
      switch(gradientEditor.prop) {
        case 'fill':
          setLayerFillGradientType({id: gradientEditor.layer, gradientType: 'linear'});
          break;
        case 'stroke':
          setLayerStrokeGradientType({id: gradientEditor.layer, gradientType: 'linear'});
          break;
      }
    }
  }

  const handleRadialGradientClick = (): void => {
    if (gradient.gradientType !== 'radial') {
      switch(gradientEditor.prop) {
        case 'fill':
          setLayerFillGradientType({id: gradientEditor.layer, gradientType: 'radial'});
          break;
        case 'stroke':
          setLayerStrokeGradientType({id: gradientEditor.layer, gradientType: 'radial'});
          break;
      }
    }
  }

  return (
    <div
      ref={editorRef}
      className='c-fill-editor'>
      <div
        className='c-fill-editor__picker'
        style={{
          top: gradientEditor.y,
          background: tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.77).toRgbString(),
          boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}, 0 4px 16px 0 rgba(0,0,0,0.16)`
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
          layer={gradientEditor.layer}
          gradient={gradient}
          onStopPress={handleStopPress} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState): {
  style: em.Fill | em.Stroke;
  gradient: em.Gradient;
  gradientEditor: GradientEditorState;
  activeStopValue: em.GradientStop;
} => {
  const { gradientEditor, layer } = state;
  const layerItem = layer.present.byId[gradientEditor.layer];
  const style = ((): em.Fill | em.Stroke => {
    switch(gradientEditor.prop) {
      case 'fill':
        return layerItem.style.fill;
      case 'stroke':
        return layerItem.style.stroke;
    }
  })();
  const gradient = style.gradient;
  const stops = gradient.stops;
  const activeStopId = stops.allIds.find((stop) => stops.byId[stop].active);
  const activeStopValue = stops.byId[activeStopId];
  return { gradientEditor: gradientEditor, style, gradient, activeStopValue };
};

export default connect(
  mapStateToProps,
  {
    closeGradientEditor,
    setLayerFillType,
    setLayerFillGradientType,
    openColorEditor,
    setLayerFillGradientStopColor,
    setLayerFillGradientStopPosition,
    setLayerFillActiveGradientStop,
    addLayerFillGradientStop,
    setLayerStrokeGradientType,
    setLayerStrokeGradientStopColor,
    setLayerStrokeGradientStopPosition,
    setLayerStrokeActiveGradientStop,
    addLayerStrokeGradientStop,
    setLayerStrokeFillType
  }
)(GradientEditor);