/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { closeColorEditor } from '../store/actions/colorEditor';
import { openGradientEditor } from '../store/actions/gradientEditor';
import { getSelectedFillColors, getSelectedShadowColors, getSelectedStrokeColors } from '../store/selectors/layer';
import { setLayersFillType, setLayersFillColors, setLayersStrokeColors, setLayersStrokeFillType, setLayersShadowColors } from '../store/actions/layer';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import { ThemeContext } from './ThemeProvider';
import ColorPicker from './ColorPicker';
import FillTypeSelector from './FillTypeSelector';

const ColorEditor = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const canvasFocusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const colorValues = useSelector((state: RootState) => {
    switch(state.colorEditor.prop) {
      case 'fill':
        return getSelectedFillColors(state);
      case 'stroke':
        return getSelectedStrokeColors(state);
      case 'shadow':
        return getSelectedShadowColors(state);
    }
  });
  const includesTextLayer = useSelector((state: RootState) => state.layer.present.selected.some((id: string) => state.layer.present.byId[id].type === 'Text'));
  const colorEditor = useSelector((state: RootState) => state.colorEditor);
  const dispatch = useDispatch();

  const debounceColors = useCallback(
    debounce((colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }) => {
      switch(colorEditor.prop) {
        case 'fill': {
          dispatch(setLayersFillColors({layers: selected, fillColors: colors}));
          // if (includesTextLayer) {
          //   dispatch(setTextSettingsFillColor({fillColor: color}));
          // }
          break;
        }
        case 'stroke':
          dispatch(setLayersStrokeColors({layers: selected, strokeColors: colors}));
          break;
        case 'shadow':
          dispatch(setLayersShadowColors({layers: selected, shadowColors: colors}));
          break;
      }
    }, 150),
    []
  );

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown);
    return (): void => {
      if (colorEditor.isOpen) {
        dispatch(closeColorEditor());
      }
      dispatch(setCanvasFocusing({focusing: true}));
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  const onMouseDown = (event: any): void => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      dispatch(closeColorEditor());
    }
  }

  const handleColorChange = (colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void => {
    debounceColors(colors);
  }

  const handleLinearGradientClick = (): void => {
    switch(colorEditor.prop) {
      case 'fill':
        dispatch(setLayersFillType({
          layers: selected,
          fillType: 'gradient',
          gradientType: 'linear'
        }));
        break;
      case 'stroke':
        dispatch(setLayersStrokeFillType({
          layers: selected,
          fillType: 'gradient',
          gradientType: 'linear'
        }));
        break;
    }
    dispatch(closeColorEditor());
    dispatch(openGradientEditor({
      prop: colorEditor.prop as 'fill' | 'stroke',
      x: colorEditor.x,
      y: colorEditor.y
    }));
  }

  const handleRadialGradientClick = (): void => {
    switch(colorEditor.prop) {
      case 'fill':
        dispatch(setLayersFillType({
          layers: selected,
          fillType: 'gradient',
          gradientType: 'radial'
        }));
        break;
      case 'stroke':
        dispatch(setLayersStrokeFillType({
          layers: selected,
          fillType: 'gradient',
          gradientType: 'radial'
        }));
        break;
    }
    dispatch(closeColorEditor());
    dispatch(openGradientEditor({
      prop: colorEditor.prop as 'fill' | 'stroke',
      x: colorEditor.x,
      y: colorEditor.y
    }));
  }

  return (
    <div
      ref={editorRef}
      className='c-fill-editor'>
      <div
        className='c-fill-editor__picker'
        style={{
          top: colorEditor.y,
          background: tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.77).toRgbString(),
          boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}, 0 4px 16px 0 rgba(0,0,0,0.16)`
        }}>
        {
          colorEditor.prop === 'fill' || colorEditor.prop === 'stroke'
          ? <FillTypeSelector
              colorSelector={{
                enabled: true,
                onClick: (): void => {return;},
                isActive: true
              }}
              linearGradientSelector={{
                enabled: true,
                onClick: handleLinearGradientClick,
                isActive: false
              }}
              radialGradientSelector={{
                enabled: true,
                onClick: handleRadialGradientClick,
                isActive: false
              }} />
          : null
        }
        <ColorPicker
          colorValues={colorValues}
          onChange={handleColorChange}
          autoFocus />
      </div>
    </div>
  );
}

export default ColorEditor;