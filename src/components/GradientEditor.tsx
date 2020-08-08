/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import tinyColor from 'tinycolor2';
import { paperMain } from '../canvas';
import { RootState } from '../store/reducers';
import { getPaperLayer, getGradientStops, getGradientOriginPoint, getGradientDestinationPoint, gradientsMatch } from '../store/selectors/layer';
import { openColorEditor } from '../store/actions/colorEditor';
import { ColorEditorTypes, OpenColorEditorPayload } from '../store/actionTypes/colorEditor';
import { closeGradientEditor } from '../store/actions/gradientEditor';
import { GradientEditorTypes } from '../store/actionTypes/gradientEditor';
import { GradientEditorState } from '../store/reducers/gradientEditor';
import { SetLayersFillTypePayload, SetLayersGradientTypePayload, SetLayerActiveGradientStopPayload, SetLayersGradientStopColorPayload, SetLayersGradientStopPositionPayload, AddLayersGradientStopPayload, SetLayersStrokeFillTypePayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersFillType, setLayersGradientType, setLayersGradientStopColor, setLayerActiveGradientStop, setLayersGradientStopPosition, addLayersGradientStop, setLayersStrokeFillType } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import ColorPicker from './ColorPicker';
import GradientSlider from './GradientSlider';
import FillTypeSelector from './FillTypeSelector';
import GradientFrame from './GradientFrame';

interface GradientEditorProps {
  style?: em.Fill | em.Stroke;
  gradient?: em.Gradient;
  gradientEditor?: GradientEditorState;
  activeStopValue?: em.GradientStop;
  closeGradientEditor?(): GradientEditorTypes;
  openColorEditor?(payload: OpenColorEditorPayload): ColorEditorTypes;
  setLayersFillType?(payload: SetLayersFillTypePayload): LayerTypes;
  setLayersGradientType?(payload: SetLayersGradientTypePayload): LayerTypes;
  setLayersGradientStopColor?(payload: SetLayersGradientStopColorPayload): LayerTypes;
  setLayersGradientStopPosition?(payload: SetLayersGradientStopPositionPayload): LayerTypes;
  setLayerActiveGradientStop?(payload: SetLayerActiveGradientStopPayload): LayerTypes;
  addLayersGradientStop?(payload: AddLayersGradientStopPayload): LayerTypes;
  setLayersStrokeFillType?(payload: SetLayersStrokeFillTypePayload): LayerTypes;
}

const GradientEditor = (props: GradientEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { gradientEditor, style, gradient, activeStopValue, setLayersGradientType, setLayersGradientStopColor, setLayerActiveGradientStop, setLayersGradientStopPosition, addLayersGradientStop, setLayersStrokeFillType, setLayersFillType, openColorEditor, closeGradientEditor } = props;

  const debounceStopColorChange = useCallback(
    debounce((stopId: string, color: em.Color) => {
      setLayersGradientStopColor({layers: gradientEditor.layers, prop: gradientEditor.prop as 'fill' | 'stroke', stopId, color});
    }, 150),
    []
  );

  const debounceStopPositionChange = useCallback(
    debounce((stopId: string, position: number) => {
      setLayersGradientStopPosition({layers: gradientEditor.layers, prop: gradientEditor.prop as 'fill' | 'stroke', stopId, position});
    }, 150),
    []
  );

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown, false);
    return (): void => {
      if (gradientEditor.isOpen) {
        closeGradientEditor();
      }
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
    setLayerActiveGradientStop({id: gradientEditor.layers[0], prop: gradientEditor.prop as 'fill' | 'stroke', stopId: id});
  }

  const handleStopDrag = (id: string, position: number): void => {
    debounceStopPositionChange(id, position);
  }

  const handleSliderClick = (newStop: em.GradientStop): void => {
    addLayersGradientStop({layers: gradientEditor.layers, prop: gradientEditor.prop as 'fill' | 'stroke', gradientStop: newStop});
  }

  const handleColorClick = (): void => {
    switch(gradientEditor.prop) {
      case 'fill':
        setLayersFillType({layers: gradientEditor.layers, fillType: 'color'});
        break;
      case 'stroke':
        setLayersStrokeFillType({layers: gradientEditor.layers, fillType: 'color'});
        break;
    }
    closeGradientEditor();
    openColorEditor({
      layers: gradientEditor.layers,
      prop: gradientEditor.prop,
      color: style.color,
      x: gradientEditor.x,
      y: gradientEditor.y
    });
  }

  const handleLinearGradientClick = (): void => {
    if (gradient.gradientType !== 'linear') {
      setLayersGradientType({layers: gradientEditor.layers, prop: gradientEditor.prop as 'fill' | 'stroke', gradientType: 'linear'});
    }
  }

  const handleRadialGradientClick = (): void => {
    if (gradient.gradientType !== 'radial') {
      setLayersGradientType({layers: gradientEditor.layers, prop: gradientEditor.prop as 'fill' | 'stroke', gradientType: 'radial'});
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
        {/* <GradientFrame
          layer={gradientEditor.layers}
          gradient={gradient}
          onStopPress={handleStopPress} /> */}
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
  const layerItems: em.Layer[] = gradientEditor.layers.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const styles: (em.Fill | em.Stroke)[] = layerItems.reduce((result, current) => {
    switch(gradientEditor.prop) {
      case 'fill':
        return [...result, current.style.fill];
      case 'stroke':
        return [...result, current.style.stroke];
    }
  }, []);
  const style = styles[0];
  const gradient = style.gradient;
  const stops = gradient.stops;
  const activeStop = stops.allIds.find((id) => stops.byId[id].active);
  const activeStopValue = stops.byId[activeStop];
  return { gradientEditor: gradientEditor, style, gradient, activeStopValue };
};

export default connect(
  mapStateToProps,
  {
    closeGradientEditor,
    setLayersFillType,
    setLayersGradientType,
    openColorEditor,
    setLayersGradientStopColor,
    setLayersGradientStopPosition,
    setLayerActiveGradientStop,
    addLayersGradientStop,
    setLayersStrokeFillType
  }
)(GradientEditor);