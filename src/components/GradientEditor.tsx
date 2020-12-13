/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import tinyColor from 'tinycolor2';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { openColorEditor } from '../store/actions/colorEditor';
import { closeGradientEditor } from '../store/actions/gradientEditor';
import { setLayersFillType, setLayersGradientType, setLayersGradientStopColor, setLayerActiveGradientStop, setLayersGradientStopPosition, addLayersGradientStop, setLayersStrokeFillType } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import ColorPicker from './ColorPicker';
import GradientSlider from './GradientSlider';
import FillTypeSelector from './FillTypeSelector';
import GradientFrame from './GradientFrame';

const GradientEditor = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const gradientValue = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.selected[0]].style[state.gradientEditor.prop].gradient);
  const activeStopValue = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.selected[0]].style[state.gradientEditor.prop].gradient.stops.find((stop, index) => index === gradientValue.activeStopIndex));
  const colorFormat = useSelector((state: RootState) => state.documentSettings.colorFormat);
  const gradientEditor = useSelector((state: RootState) => state.gradientEditor);
  const dispatch = useDispatch();

  const debounceStopColorChange = useCallback(
    debounce((stopIndex: number, color: Btwx.Color) => {
      dispatch(setLayersGradientStopColor({layers: selected, prop: gradientEditor.prop as 'fill' | 'stroke', stopIndex, color}));
    }, 150),
    []
  );

  const debounceStopPositionChange = useCallback(
    debounce((stopIndex: number, position: number) => {
      dispatch(setLayersGradientStopPosition({layers: selected, prop: gradientEditor.prop as 'fill' | 'stroke', stopIndex, position}));
    }, 150),
    []
  );

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown, false);
    return (): void => {
      if (gradientEditor.isOpen) {
        dispatch(closeGradientEditor());
      }
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  const onMouseDown = (event: any): void => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      if ((event.target.id as string).startsWith('canvas')) {
        const eventPoint = uiPaperScope.view.getEventPoint(event);
        const hitResult = uiPaperScope.project.hitTest(eventPoint);
        if (!hitResult || !(hitResult.item && hitResult.item.data && hitResult.item.data.interactive && hitResult.item.data.elementId === 'gradientFrame')) {
          dispatch(closeGradientEditor());
        }
      } else {
        dispatch(closeGradientEditor());
      }
    }
  }

  const handleActiveStopColorChange = (stopColor: Btwx.Color): void => {
    // const paperLayer = getPaperLayer(gradientEditor.layer);
    // const newStopsById = Object.keys(gradient.stops.byId).reduce((result: { [id: string]: Btwx.GradientStop }, current) => {
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
    debounceStopColorChange(gradientValue.activeStopIndex, stopColor);
  }

  const handleStopPress = (stopIndex: number): void => {
    dispatch(setLayerActiveGradientStop({id: selected[0], prop: gradientEditor.prop as 'fill' | 'stroke', stopIndex}));
  }

  const handleStopDrag = (stopIndex: number, position: number): void => {
    debounceStopPositionChange(stopIndex, position);
  }

  const handleSliderClick = (newStop: Btwx.GradientStop): void => {
    dispatch(addLayersGradientStop({layers: selected, prop: gradientEditor.prop as 'fill' | 'stroke', gradientStop: newStop}));
  }

  const handleColorClick = (): void => {
    switch(gradientEditor.prop) {
      case 'fill':
        dispatch(setLayersFillType({layers: selected, fillType: 'color'}));
        break;
      case 'stroke':
        dispatch(setLayersStrokeFillType({layers: selected, fillType: 'color'}));
        break;
    }
    dispatch(closeGradientEditor());
    dispatch(openColorEditor({
      prop: gradientEditor.prop,
      x: gradientEditor.x,
      y: gradientEditor.y
    }));
  }

  const handleLinearGradientClick = (): void => {
    if (gradientValue.gradientType !== 'linear') {
      dispatch(setLayersGradientType({layers: selected, prop: gradientEditor.prop as 'fill' | 'stroke', gradientType: 'linear'}));
    }
  }

  const handleRadialGradientClick = (): void => {
    if (gradientValue.gradientType !== 'radial') {
      dispatch(setLayersGradientType({layers: selected, prop: gradientEditor.prop as 'fill' | 'stroke', gradientType: 'radial'}));
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
            isActive: gradientValue.gradientType === 'linear'
          }}
          radialGradientSelector={{
            enabled: true,
            onClick: handleRadialGradientClick,
            isActive: gradientValue.gradientType === 'radial'
          }} />
        <GradientSlider
          gradientStops={gradientValue.stops}
          activeStopIndex={gradientValue.activeStopIndex}
          onStopPress={handleStopPress}
          onStopDrag={handleStopDrag}
          onSliderClick={handleSliderClick}
        />
        <ColorPicker
          colorValue={activeStopValue.color}
          colorType={colorFormat}
          onChange={handleActiveStopColorChange} />
      </div>
    </div>
  );
}

export default GradientEditor;