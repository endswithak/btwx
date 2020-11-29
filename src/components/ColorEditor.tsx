/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { closeColorEditor } from '../store/actions/colorEditor';
import { ColorEditorTypes } from '../store/actionTypes/colorEditor';
import { openGradientEditor } from '../store/actions/gradientEditor';
import { colorsMatch, gradientsMatch, getPaperLayer, getSelectedById } from '../store/selectors/layer';
import { GradientEditorTypes, OpenGradientEditorPayload } from '../store/actionTypes/gradientEditor';
import { ColorEditorState } from '../store/reducers/colorEditor';
import { SetLayersFillTypePayload, SetLayersFillColorPayload, SetLayersStrokeFillTypePayload, SetLayersStrokeColorPayload, SetLayersShadowColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersFillType, setLayersFillColor, setLayersStrokeColor, setLayersStrokeFillType, setLayersShadowColor } from '../store/actions/layer';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasFocusingPayload } from '../store/actionTypes/canvasSettings';
import { ThemeContext } from './ThemeProvider';
import ColorPicker from './ColorPicker';
import FillTypeSelector from './FillTypeSelector';

interface ColorEditorProps {
  selected: string[];
  includesTextLayer?: boolean;
  colorEditor?: ColorEditorState;
  colorFormat?: Btwx.ColorFormat;
  colorValue?: Btwx.Color;
  canvasFocusing?: boolean;
  closeColorEditor?(): ColorEditorTypes;
  openGradientEditor?(payload: OpenGradientEditorPayload): GradientEditorTypes;
  setLayersShadowColor?(payload: SetLayersShadowColorPayload): LayerTypes;
  setLayersFillColor?(payload: SetLayersFillColorPayload): LayerTypes;
  setLayersFillType?(payload: SetLayersFillTypePayload): LayerTypes;
  setLayersStrokeColor?(payload: SetLayersStrokeColorPayload): LayerTypes;
  setLayersStrokeFillType?(payload: SetLayersStrokeFillTypePayload): LayerTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
  setCanvasFocusing?(payload: SetCanvasFocusingPayload): CanvasSettingsTypes;
}

const ColorEditor = (props: ColorEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { selected, includesTextLayer, colorEditor, colorFormat, colorValue, closeColorEditor, setLayersFillColor, setLayersStrokeFillType, setLayersFillType, setLayersStrokeColor, openGradientEditor, setLayersShadowColor, setTextSettingsFillColor, setCanvasFocusing, canvasFocusing } = props;

  const debounceColor = useCallback(
    debounce((color: Btwx.Color) => {
      switch(colorEditor.prop) {
        case 'fill': {
          setLayersFillColor({layers: selected, fillColor: color});
          if (includesTextLayer) {
            setTextSettingsFillColor({fillColor: color});
          }
          break;
        }
        case 'stroke':
          setLayersStrokeColor({layers: selected, strokeColor: color});
          break;
        case 'shadow':
          setLayersShadowColor({layers: selected, shadowColor: color});
          break;
      }
    }, 150),
    []
  );

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown, false);
    return (): void => {
      if (colorEditor.isOpen) {
        closeColorEditor();
      }
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  const onMouseDown = (event: any): void => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      closeColorEditor();
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
        setLayersFillType({
          layers: selected,
          fillType: 'gradient',
          gradientType: 'linear'
        });
        break;
      case 'stroke':
        setLayersStrokeFillType({
          layers: selected,
          fillType: 'gradient',
          gradientType: 'linear'
        });
        break;
    }
    closeColorEditor();
    openGradientEditor({
      prop: colorEditor.prop as 'fill' | 'stroke',
      x: colorEditor.x,
      y: colorEditor.y
    });
  }

  const handleRadialGradientClick = (): void => {
    switch(colorEditor.prop) {
      case 'fill':
        setLayersFillType({
          layers: selected,
          fillType: 'gradient',
          gradientType: 'radial'
        });
        break;
      case 'stroke':
        setLayersStrokeFillType({
          layers: selected,
          fillType: 'gradient',
          gradientType: 'radial'
        });
        break;
    }
    closeColorEditor();
    openGradientEditor({
      prop: colorEditor.prop as 'fill' | 'stroke',
      x: colorEditor.x,
      y: colorEditor.y
    });
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

const mapStateToProps = (state: RootState): {
  selected: string[];
  colorEditor: ColorEditorState;
  includesTextLayer: boolean;
  canvasFocusing: boolean;
  colorFormat: Btwx.ColorFormat;
  colorValue: Btwx.Color;
} => {
  const { colorEditor, layer, canvasSettings, documentSettings } = state;
  const selected = layer.present.selected;
  const selectedById = getSelectedById(state);
  const styleValue = selectedById[selected[0]].style[colorEditor.prop];
  const colorValue = styleValue.color;
  const includesTextLayer = selected.some((id: string) => selectedById[id].type === 'Text');
  const canvasFocusing = canvasSettings.focusing;
  const colorFormat = documentSettings.colorFormat;
  return { selected, colorEditor, includesTextLayer, canvasFocusing, colorFormat, colorValue };
};

export default connect(
  mapStateToProps,
  {
    closeColorEditor,
    openGradientEditor,
    setLayersFillColor,
    setLayersStrokeColor,
    setLayersShadowColor,
    setLayersFillType,
    setLayersStrokeFillType,
    setTextSettingsFillColor,
    setCanvasFocusing
  }
)(ColorEditor);