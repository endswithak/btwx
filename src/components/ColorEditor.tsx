/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeColorEditor } from '../store/actions/colorEditor';
import { ColorEditorTypes } from '../store/actionTypes/colorEditor';
import { openGradientEditor } from '../store/actions/gradientEditor';
import { getPaperLayer } from '../store/selectors/layer';
import { GradientEditorTypes, OpenGradientEditorPayload } from '../store/actionTypes/gradientEditor';
import { ColorEditorState } from '../store/reducers/colorEditor';
import ColorPicker from './ColorPicker';
import { SetLayerFillTypePayload, SetLayerFillGradientTypePayload, SetLayerFillColorPayload, SetLayerFillPayload, SetLayerStrokeFillTypePayload, SetLayerStrokeGradientTypePayload, SetLayerStrokeColorPayload, SetLayerShadowColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerFillType, setLayerFillGradientType, setLayerFillColor, setLayerStrokeColor, setLayerStrokeFillType, setLayerStrokeGradientType, setLayerShadowColor } from '../store/actions/layer';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import FillTypeSelector from './FillTypeSelector';

interface ColorEditorProps {
  layerItem?: em.Layer;
  style?: em.Fill | em.Stroke | em.Shadow;
  colorEditor?: ColorEditorState;
  closeColorEditor?(): ColorEditorTypes;
  openGradientEditor?(payload: OpenGradientEditorPayload): GradientEditorTypes;
  setLayerShadowColor?(payload: SetLayerShadowColorPayload): LayerTypes;
  setLayerFillColor?(payload: SetLayerFillColorPayload): LayerTypes;
  setLayerFillType?(payload: SetLayerFillTypePayload): LayerTypes;
  setLayerFillGradientType?(payload: SetLayerFillGradientTypePayload): LayerTypes;
  setLayerFill?(payload: SetLayerFillPayload): LayerTypes;
  setLayerStrokeColor?(payload: SetLayerStrokeColorPayload): LayerTypes;
  setLayerStrokeFillType?(payload: SetLayerStrokeFillTypePayload): LayerTypes;
  setLayerStrokeGradientType?(payload: SetLayerStrokeGradientTypePayload): LayerTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
}

const ColorEditor = (props: ColorEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { layerItem, style, colorEditor, closeColorEditor, setLayerFillColor, setLayerStrokeFillType, setLayerStrokeGradientType, setLayerFillType, setLayerStrokeColor, setLayerFillGradientType, openGradientEditor, setLayerShadowColor, setTextSettingsFillColor } = props;

  const debounceColor = useCallback(
    debounce((color: em.Color) => {
      switch(colorEditor.prop) {
        case 'fill': {
          setLayerFillColor({id: colorEditor.layer, fillColor: color});
          if (layerItem.type === 'Text') {
            setTextSettingsFillColor({fillColor: color});
          }
          break;
        }
        case 'stroke':
          setLayerStrokeColor({id: colorEditor.layer, strokeColor: color});
          break;
        case 'shadow':
          setLayerShadowColor({id: colorEditor.layer, shadowColor: color});
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
      closeColorEditor();
    }
  }

  const handleColorChange = (color: em.Color): void => {
    // const paperLayer = getPaperLayer(colorEditor.layer);
    // switch(colorEditor.prop) {
    //   case 'fill':
    //     paperLayer.fillColor = { hue: color.h, saturation: color.s, lightness: color.l, alpha: color.a } as paper.Color;
    //     break;
    //   case 'stroke':
    //     paperLayer.strokeColor = { hue: color.h, saturation: color.s, lightness: color.l, alpha: color.a } as paper.Color;
    //     break;
    //   case 'shadow':
    //     paperLayer.shadowColor = { hue: color.h, saturation: color.s, lightness: color.l, alpha: color.a } as paper.Color;
    //     break;
    // }
    debounceColor(color);
  }

  const handleLinearGradientClick = (): void => {
    switch(colorEditor.prop) {
      case 'fill':
        setLayerFillType({id: colorEditor.layer, fillType: 'gradient'});
        break;
      case 'stroke':
        setLayerStrokeFillType({id: colorEditor.layer, fillType: 'gradient'});
        break;
    }
    if (colorEditor.prop !== 'shadow' && (style as em.Fill | em.Stroke).gradient.gradientType !== 'linear') {
      switch(colorEditor.prop) {
        case 'fill':
          setLayerFillGradientType({id: colorEditor.layer, gradientType: 'linear'});
          break;
        case 'stroke':
          setLayerStrokeGradientType({id: colorEditor.layer, gradientType: 'linear'});
          break;
      }
    }
    closeColorEditor();
    openGradientEditor({
      layer: colorEditor.layer,
      prop: colorEditor.prop,
      gradient: {
        ...(style as em.Fill | em.Stroke).gradient,
        gradientType: 'linear'
      },
      x: colorEditor.x,
      y: colorEditor.y
    });
  }

  const handleRadialGradientClick = (): void => {
    switch(colorEditor.prop) {
      case 'fill':
        setLayerFillType({id: colorEditor.layer, fillType: 'gradient'});
        break;
      case 'stroke':
        setLayerStrokeFillType({id: colorEditor.layer, fillType: 'gradient'});
        break;
    }
    if (colorEditor.prop !== 'shadow' && (style as em.Fill | em.Stroke).gradient.gradientType !== 'radial') {
      switch(colorEditor.prop) {
        case 'fill':
          setLayerFillGradientType({id: colorEditor.layer, gradientType: 'radial'});
          break;
        case 'stroke':
          setLayerStrokeGradientType({id: colorEditor.layer, gradientType: 'radial'});
          break;
      }
    }
    closeColorEditor();
    openGradientEditor({
      layer: colorEditor.layer,
      prop: colorEditor.prop,
      gradient: {
        ...(style as em.Fill | em.Stroke).gradient,
        gradientType: 'radial'
      },
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
          colorValue={style.color}
          colorType='rgb'
          onChange={handleColorChange} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState): {
  layerItem: em.Layer;
  style: em.Fill | em.Stroke | em.Shadow;
  colorEditor: ColorEditorState;
} => {
  const { colorEditor, layer } = state;
  const layerItem = layer.present.byId[colorEditor.layer];
  const style = ((): em.Fill | em.Stroke | em.Shadow => {
    switch(colorEditor.prop) {
      case 'fill':
        return layerItem.style.fill;
      case 'stroke':
        return layerItem.style.stroke;
      case 'shadow':
        return layerItem.style.shadow;
    }
  })();
  return { colorEditor, layerItem, style };
};

export default connect(
  mapStateToProps,
  {
    closeColorEditor,
    openGradientEditor,
    setLayerFillColor,
    setLayerStrokeColor,
    setLayerShadowColor,
    setLayerFillType,
    setLayerStrokeFillType,
    setLayerFillGradientType,
    setLayerStrokeGradientType,
    setTextSettingsFillColor
  }
)(ColorEditor);