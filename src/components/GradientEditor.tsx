/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import tinyColor from 'tinycolor2';
import { paperMain } from '../canvas';
import { RootState } from '../store/reducers';
import { openColorEditor } from '../store/actions/colorEditor';
import { closeGradientEditor } from '../store/actions/gradientEditor';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import { setLayersFillType, setLayersGradientType, setLayersGradientStopColor, setLayerActiveGradientStop, setLayersGradientStopPosition, addLayersGradientStop, setLayersStrokeFillType } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import ColorPicker from './ColorPicker';
import GradientSlider from './GradientSlider';
import FillTypeSelector from './FillTypeSelector';

const GradientEditor = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const gradientValue = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.selected[0]].style[state.gradientEditor.prop].gradient);
  const activeStopValue = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.selected[0]].style[state.gradientEditor.prop].gradient.stops.find((stop, index) => index === gradientValue.activeStopIndex));
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
      dispatch(setCanvasFocusing({focusing: true}));
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  const onMouseDown = (event: any): void => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      if ((event.target.id as string).startsWith('canvas')) {
        const eventPoint = paperMain.view.getEventPoint(event);
        const hitResult = paperMain.project.hitTest(eventPoint);
        if (!hitResult || !(hitResult.item && hitResult.item.data && hitResult.item.data.interactive && hitResult.item.data.elementId === 'gradientFrame')) {
          dispatch(closeGradientEditor());
        }
      } else {
        dispatch(closeGradientEditor());
      }
    }
  }

  const handleActiveStopColorChange = (colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void => {
    debounceStopColorChange(gradientValue.activeStopIndex, colors[selected[0]]);
  }

  const handleStopPress = (stopIndex: number): void => {
    dispatch(setLayerActiveGradientStop({
      id: selected[0],
      prop: gradientEditor.prop as 'fill' | 'stroke',
      stopIndex
    }));
  }

  const handleStopDrag = (stopIndex: number, position: number): void => {
    debounceStopPositionChange(stopIndex, position);
  }

  const handleSliderClick = (newStop: Btwx.GradientStop): void => {
    dispatch(addLayersGradientStop({
      layers: selected,
      prop: gradientEditor.prop as 'fill' | 'stroke',
      gradientStop: newStop
    }));
  }

  const handleColorClick = (): void => {
    switch(gradientEditor.prop) {
      case 'fill':
        dispatch(setLayersFillType({
          layers: selected,
          fillType: 'color'
        }));
        break;
      case 'stroke':
        dispatch(setLayersStrokeFillType({
          layers: selected,
          fillType: 'color'
        }));
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
      dispatch(setLayersGradientType({
        layers: selected,
        prop: gradientEditor.prop as 'fill' | 'stroke',
        gradientType: 'linear'
      }));
    }
  }

  const handleRadialGradientClick = (): void => {
    if (gradientValue.gradientType !== 'radial') {
      dispatch(setLayersGradientType({
        layers: selected,
        prop: gradientEditor.prop as 'fill' | 'stroke',
        gradientType: 'radial'
      }));
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
          onSliderClick={handleSliderClick} />
        <ColorPicker
          colorValues={{[`${selected[0]}`]: activeStopValue.color}}
          onChange={handleActiveStopColorChange} />
      </div>
    </div>
  );
}

export default GradientEditor;