/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { closeColorEditor } from '../store/actions/colorEditor';
import { ColorEditorTypes } from '../store/actionTypes/colorEditor';
import { openGradientEditor } from '../store/actions/gradientEditor';
import { colorsMatch, gradientsMatch, getPaperLayer } from '../store/selectors/layer';
import { GradientEditorTypes, OpenGradientEditorPayload } from '../store/actionTypes/gradientEditor';
import { ColorEditorState } from '../store/reducers/colorEditor';
import { SetLayersFillTypePayload, SetLayersGradientTypePayload, SetLayersFillColorPayload, SetLayersStrokeFillTypePayload, SetLayersStrokeColorPayload, SetLayersShadowColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersFillType, setLayersGradientType, setLayersFillColor, setLayersStrokeColor, setLayersStrokeFillType, setLayersShadowColor } from '../store/actions/layer';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import { ThemeContext } from './ThemeProvider';
import ColorPicker from './ColorPicker';
import FillTypeSelector from './FillTypeSelector';

interface ColorEditorProps {
  includesTextLayer?: boolean;
  colorEditor?: ColorEditorState;
  colorValue?: em.Color;
  closeColorEditor?(): ColorEditorTypes;
  openGradientEditor?(payload: OpenGradientEditorPayload): GradientEditorTypes;
  setLayersShadowColor?(payload: SetLayersShadowColorPayload): LayerTypes;
  setLayersFillColor?(payload: SetLayersFillColorPayload): LayerTypes;
  setLayersFillType?(payload: SetLayersFillTypePayload): LayerTypes;
  setLayersGradientType?(payload: SetLayersGradientTypePayload): LayerTypes;
  setLayersStrokeColor?(payload: SetLayersStrokeColorPayload): LayerTypes;
  setLayersStrokeFillType?(payload: SetLayersStrokeFillTypePayload): LayerTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
}

const ColorEditor = (props: ColorEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { includesTextLayer, colorEditor, colorValue, closeColorEditor, setLayersFillColor, setLayersStrokeFillType, setLayersGradientType, setLayersFillType, setLayersStrokeColor, openGradientEditor, setLayersShadowColor, setTextSettingsFillColor } = props;

  const debounceColor = useCallback(
    debounce((color: em.Color) => {
      switch(colorEditor.prop) {
        case 'fill': {
          setLayersFillColor({layers: colorEditor.layers, fillColor: color});
          if (includesTextLayer) {
            setTextSettingsFillColor({fillColor: color});
          }
          break;
        }
        case 'stroke':
          setLayersStrokeColor({layers: colorEditor.layers, strokeColor: color});
          break;
        case 'shadow':
          setLayersShadowColor({layers: colorEditor.layers, shadowColor: color});
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

  const handleColorChange = (color: em.Color): void => {
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
    debounceColor(color);
  }

  const handleLinearGradientClick = (): void => {
    switch(colorEditor.prop) {
      case 'fill':
        setLayersFillType({layers: colorEditor.layers, fillType: 'gradient'});
        break;
      case 'stroke':
        setLayersStrokeFillType({layers: colorEditor.layers, fillType: 'gradient'});
        break;
    }
    setLayersGradientType({layers: colorEditor.layers, prop: colorEditor.prop as 'fill' | 'stroke', gradientType: 'linear'});
    closeColorEditor();
    openGradientEditor({
      layers: colorEditor.layers,
      prop: colorEditor.prop,
      x: colorEditor.x,
      y: colorEditor.y
    });
  }

  const handleRadialGradientClick = (): void => {
    switch(colorEditor.prop) {
      case 'fill':
        setLayersFillType({layers: colorEditor.layers, fillType: 'gradient'});
        break;
      case 'stroke':
        setLayersStrokeFillType({layers: colorEditor.layers, fillType: 'gradient'});
        break;
    }
    setLayersGradientType({layers: colorEditor.layers, prop: colorEditor.prop as 'fill' | 'stroke', gradientType: 'radial'});
    closeColorEditor();
    openGradientEditor({
      layers: colorEditor.layers,
      prop: colorEditor.prop,
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
          colorType='rgb'
          onChange={handleColorChange} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState): {
  colorEditor: ColorEditorState;
  colorValue: em.Color;
  includesTextLayer: boolean;
} => {
  const { colorEditor, layer } = state;
  const layerItems: em.Layer[] = colorEditor.layers.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const includesTextLayer = layerItems.some((layerItem: em.Layer) => layerItem.type === 'Text');
  const styleValues: (em.Fill | em.Stroke | em.Shadow)[] = layerItems.reduce((result, current) => {
    switch(colorEditor.prop) {
      case 'fill':
        return [...result, current.style.fill];
      case 'stroke':
        return [...result, current.style.stroke];
      case 'shadow':
        return [...result, current.style.shadow];
    }
  }, []);
  const colorValue = styleValues[0].color;
  return { colorEditor, colorValue, includesTextLayer };
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
    setLayersGradientType,
    setTextSettingsFillColor
  }
)(ColorEditor);