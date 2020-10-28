import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { colorsMatch } from '../store/selectors/layer';
import { EnableLayersFillPayload, SetLayersFillColorPayload, EnableLayersShadowPayload, SetLayersShadowColorPayload, EnableLayersStrokePayload, SetLayersStrokeColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayersFill, setLayersFillColor, enableLayersShadow, setLayersShadowColor, enableLayersStroke, setLayersStrokeColor } from '../store/actions/layer';
import { OpenColorEditorPayload, ColorEditorTypes } from '../store/actionTypes/colorEditor';
import { openColorEditor } from '../store/actions/colorEditor';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';

interface ColorInputProps {
  prop: 'fill' | 'stroke' | 'shadow';
  enabledValue?: boolean | 'multi';
  selected?: string[];
  colorValue?: Btwx.Color | 'multi';
  opacityValue?: number | 'multi';
  colorEditorOpen?: boolean;
  textLayerSelected?: boolean;
  openColorEditor?(payload: OpenColorEditorPayload): ColorEditorTypes;
  enableLayersFill?(payload: EnableLayersFillPayload): LayerTypes;
  enableLayersStroke?(payload: EnableLayersStrokePayload): LayerTypes;
  enableLayersShadow?(payload: EnableLayersShadowPayload): LayerTypes;
  setLayersFillColor?(payload: SetLayersFillColorPayload): LayerTypes;
  setLayersStrokeColor?(payload: SetLayersStrokeColorPayload): LayerTypes;
  setLayersShadowColor?(payload: SetLayersShadowColorPayload): LayerTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
}

const ColorInput = (props: ColorInputProps): ReactElement => {
  const { prop, enabledValue, selected, textLayerSelected, colorValue, opacityValue, colorEditorOpen, enableLayersFill, enableLayersStroke, enableLayersShadow, openColorEditor, setTextSettingsFillColor, setLayersFillColor, setLayersStrokeColor, setLayersShadowColor } = props;
  const [enabled, setEnabled] = useState<boolean | 'multi'>(enabledValue);
  const [color, setColor] = useState<em.Color | 'multi'>(colorValue);
  const [opacity, setOpacity] = useState(opacityValue !== 'multi' ? Math.round(opacityValue * 100) : opacityValue);
  const [hex, setHex] = useState(colorValue !== 'multi' ? tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex() : colorValue);

  useEffect(() => {
    setEnabled(enabledValue);
    setColor(colorValue);
    setOpacity(opacityValue !== 'multi' ? Math.round(opacityValue * 100) : opacityValue);
    setHex(colorValue !== 'multi' ? tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex() : colorValue);
  }, [colorValue, opacityValue, selected, enabledValue]);

  const handleOpacityChange = (e: any): void => {
    const target = e.target;
    setOpacity(target.value);
  };

  const handleHexChange = (e: any): void => {
    const target = e.target;
    setHex(target.value);
  };

  const handleOpacitySubmit = (e: any): void => {
    try {
      let nextOpacity = mexp.eval(`${opacity}`) as any;
      if (nextOpacity !== opacityValue) {
        if (nextOpacity > 100) {
          nextOpacity = 100;
        }
        if (nextOpacity < 0) {
          nextOpacity = 0;
        }
        const nextAlpha = { a: nextOpacity / 100 } as Btwx.Color;
        switch(prop) {
          case 'fill':
            setLayersFillColor({layers: selected, fillColor: nextAlpha});
            break;
          case 'stroke':
            setLayersStrokeColor({layers: selected, strokeColor: nextAlpha});
            break;
          case 'shadow':
            setLayersShadowColor({layers: selected, shadowColor: nextAlpha});
            break;
        }
      } else {
        setOpacity(opacityValue !== 'multi' ? Math.round(opacityValue * 100) : opacityValue);
      }
    } catch(error) {
      setOpacity(opacityValue !== 'multi' ? Math.round(opacityValue * 100) : opacityValue);
    }
  }

  const handleHexSubmit = (e: any): void => {
    const nextHex = tinyColor(hex);
    if (nextHex.isValid()) {
      const hsl = nextHex.toHsl();
      const hsv = nextHex.toHsv();
      const nextColor = { h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v } as Btwx.Color;
      switch(prop) {
        case 'fill': {
          setLayersFillColor({layers: selected, fillColor: nextColor});
          if (textLayerSelected) {
            setTextSettingsFillColor({fillColor: nextColor});
          }
          break;
        }
        case 'stroke':
          setLayersStrokeColor({layers: selected, strokeColor: nextColor});
          break;
        case 'shadow':
          setLayersShadowColor({layers: selected, shadowColor: nextColor});
          break;
      }
    } else {
      setHex(colorValue !== 'multi' ? tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex() : colorValue);
    }
  };

  const handleSwatchClick = (bounding: DOMRect): void => {
    if (!enabled || enabled === 'multi') {
      switch(prop) {
        case 'fill':
          enableLayersFill({layers: selected});
          break;
        case 'stroke':
          enableLayersStroke({layers: selected});
          break;
        case 'shadow':
          enableLayersShadow({layers: selected});
          break;
      }
    }
    if (!colorEditorOpen) {
      openColorEditor({
        prop: prop,
        layers: selected,
        x: bounding.x,
        y: bounding.y - (bounding.height - 10) // 2 (swatch drop shadow) + 8 (top-padding)
      });
    }
  };

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarSwatch
          isActive={colorEditorOpen}
          style={{
            background: color !== 'multi' ? tinyColor(color).toHslString() : 'none'
          }}
          onClick={handleSwatchClick}
          bottomLabel='Color'
          multi={color === 'multi'} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={hex}
          onChange={handleHexChange}
          onSubmit={handleHexSubmit}
          submitOnBlur
          disabled={!enabled || enabled === 'multi'}
          leftLabel={'#'}
          bottomLabel={'Hex'} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={opacity}
          onChange={handleOpacityChange}
          onSubmit={handleOpacitySubmit}
          submitOnBlur
          label={'%'}
          disabled={!enabled || enabled === 'multi'}
          bottomLabel={'Opacity'} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

const mapStateToProps = (state: RootState, ownProps: ColorInputProps): {
  enabledValue: boolean | 'multi';
  selected: string[];
  colorValue: Btwx.Color | 'multi';
  opacityValue: number | 'multi';
  colorEditorOpen: boolean;
  textLayerSelected: boolean;
} => {
  const { layer, colorEditor } = state;
  const selected = layer.present.selected;
  const layerItems: Btwx.Layer[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const textLayerSelected = layerItems.some((layerItem: Btwx.Layer) => layerItem.type === 'Text');
  const styleValues: (em.Fill | Btwx.Stroke | Btwx.Shadow)[] = layerItems.reduce((result, current) => {
    switch(ownProps.prop) {
      case 'fill':
        return [...result, current.style.fill];
      case 'stroke':
        return [...result, current.style.stroke];
      case 'shadow':
        return [...result, current.style.shadow];
    }
  }, []);
  const colorValue = ((): Btwx.Color | 'multi' => {
    if (styleValues.every((value: Btwx.Fill | Btwx.Stroke | Btwx.Shadow) => colorsMatch(value.color, styleValues[0].color))) {
      return styleValues[0].color;
    } else {
      return 'multi';
    }
  })();
  const opacityValue = ((): number | 'multi' => {
    if (styleValues.every((value: Btwx.Fill | Btwx.Stroke | Btwx.Shadow) => value.color.a === styleValues[0].color.a)) {
      return styleValues[0].color.a;
    } else {
      return 'multi';
    }
  })();
  const enabledValue = ((): boolean | 'multi' => {
    if (styleValues.every((value: Btwx.Fill | Btwx.Stroke | Btwx.Shadow) => value.enabled === styleValues[0].enabled)) {
      return styleValues[0].enabled;
    } else {
      return 'multi';
    }
  })();
  const colorEditorOpen = colorEditor.isOpen;
  return { enabledValue, selected, colorValue, opacityValue, colorEditorOpen, textLayerSelected };
};

export default connect(
  mapStateToProps,
  {
    setLayersFillColor,
    setLayersStrokeColor,
    setLayersShadowColor,
    enableLayersFill,
    enableLayersStroke,
    enableLayersShadow,
    openColorEditor,
    setTextSettingsFillColor,
  }
)(ColorInput);