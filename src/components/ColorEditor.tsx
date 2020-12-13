/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { closeColorEditor } from '../store/actions/colorEditor';
import { openGradientEditor } from '../store/actions/gradientEditor';
import { setLayersFillType, setLayersFillColor, setLayersStrokeColor, setLayersStrokeFillType, setLayersShadowColor } from '../store/actions/layer';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
// import { setCanvasFocusing } from '../store/actions/canvasSettings';
import { ThemeContext } from './ThemeProvider';
import ColorPicker from './ColorPicker';
import FillTypeSelector from './FillTypeSelector';

const ColorEditor = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const colorValue = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.selected[0]].style[state.colorEditor.prop].color);
  // const colorValue = styleValue && styleValue.color;
  const includesTextLayer = useSelector((state: RootState) => state.layer.present.selected.some((id: string) => state.layer.present.byId[id].type === 'Text'));
  // const canvasFocusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const colorFormat = useSelector((state: RootState) => state.documentSettings.colorFormat);
  const colorEditor = useSelector((state: RootState) => state.colorEditor);
  const dispatch = useDispatch();

  const debounceColor = useCallback(
    debounce((color: Btwx.Color) => {
      switch(colorEditor.prop) {
        case 'fill': {
          dispatch(setLayersFillColor({layers: selected, fillColor: color}));
          if (includesTextLayer) {
            dispatch(setTextSettingsFillColor({fillColor: color}));
          }
          break;
        }
        case 'stroke':
          dispatch(setLayersStrokeColor({layers: selected, strokeColor: color}));
          break;
        case 'shadow':
          dispatch(setLayersShadowColor({layers: selected, shadowColor: color}));
          break;
      }
    }, 150),
    []
  );

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown, false);
    return (): void => {
      if (colorEditor.isOpen) {
        dispatch(closeColorEditor());
      }
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  const onMouseDown = (event: any): void => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      dispatch(closeColorEditor());
    }
  }

  const handleColorChange = (color: Btwx.Color): void => {
    // colorEditor.layers.forEach((layer) => {
    //   const paperLayer = getPaperLayer(layer);
    //   switch(colorEditor.prop) {
    //     case 'fill':
    //       paperLayer.fillColor = { hue: color.h, saturation: color.s, lightness: color.l, alpha: color.a } as paper.Color;
    //       break;
    //     case 'stroke':
    //       paperLayer.strokeColor = { hue: color.h, saturation: color.s, lightness: color.l, alpha: color.a } as paper.Color;
    //       break;
    //     case 'shadow':
    //       paperLayer.shadowColor = { hue: color.h, saturation: color.s, lightness: color.l, alpha: color.a } as paper.Color;
    //       break;
    //   }
    // });
    // setColorEditorColor({color});
    debounceColor(color);
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
          colorValue={colorValue}
          colorType={colorFormat}
          onChange={handleColorChange} />
      </div>
    </div>
  );
}

export default ColorEditor;