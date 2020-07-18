import paper from 'paper';
import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import { RootState } from '../store/reducers';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import { EnableLayerFillPayload, SetLayerFillColorPayload, EnableLayerShadowPayload, SetLayerShadowColorPayload, EnableLayerStrokePayload, SetLayerStrokeColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerFill, setLayerFillColor, enableLayerShadow, setLayerShadowColor, enableLayerStroke, setLayerStrokeColor } from '../store/actions/layer';
import { OpenColorEditorPayload, ColorEditorTypes } from '../store/actionTypes/colorEditor';
import { openColorEditor } from '../store/actions/colorEditor';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import tinyColor from 'tinycolor2';

interface ColorInputProps {
  prop: 'fill' | 'stroke' | 'shadow';
  enabled?: boolean;
  selected?: string[];
  selectedType?: em.LayerType;
  colorValue?: em.Color;
  colorEditorOpen?: boolean;
  openColorEditor?(payload: OpenColorEditorPayload): ColorEditorTypes;
  enableLayerFill?(payload: EnableLayerFillPayload): LayerTypes;
  enableLayerStroke?(payload: EnableLayerStrokePayload): LayerTypes;
  enableLayerShadow?(payload: EnableLayerShadowPayload): LayerTypes;
  setLayerFillColor?(payload: SetLayerFillColorPayload): LayerTypes;
  setLayerStrokeColor?(payload: SetLayerStrokeColorPayload): LayerTypes;
  setLayerShadowColor?(payload: SetLayerShadowColorPayload): LayerTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
}

const FillColorInput = (props: ColorInputProps): ReactElement => {
  const { prop, enabled, selected, selectedType, colorValue, colorEditorOpen, enableLayerFill, enableLayerStroke, enableLayerShadow, openColorEditor, setTextSettingsFillColor, setLayerFillColor, setLayerStrokeColor, setLayerShadowColor } = props;
  const [enabledValue, setEnabledValue] = useState<boolean>(enabled);
  const [color, setColor] = useState(colorValue);
  const [opacity, setOpacity] = useState<number | string>(colorValue.a * 100);
  const [hex, setHex] = useState(tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex());

  useEffect(() => {
    setEnabledValue(enabled);
    setColor(colorValue);
    setOpacity(colorValue.a * 100);
    setHex(tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex());
  }, [colorValue, selected, enabled]);

  const handleOpacityChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  const handleHexChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setHex(target.value);
  };

  const handleOpacitySubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    try {
      let nextOpacity = evaluate(`${opacity}`);
      if (nextOpacity !== colorValue.a && !isNaN(nextOpacity)) {
        if (nextOpacity > 100) {
          nextOpacity = 100;
        }
        if (nextOpacity < 0) {
          nextOpacity = 0;
        }
        switch(prop) {
          case 'fill':
            setLayerFillColor({id: selected[0], fillColor: {...color, a: nextOpacity / 100}});
            break;
          case 'stroke':
            setLayerStrokeColor({id: selected[0], strokeColor: {...color, a: nextOpacity / 100}});
            break;
          case 'shadow':
            setLayerShadowColor({id: selected[0], shadowColor: {...color, a: nextOpacity / 100}});
            break;
        }
      } else {
        setOpacity(colorValue.a * 100);
      }
    } catch(error) {
      setOpacity(colorValue.a * 100);
    }
  }

  const handleHexSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const nextHex = tinyColor(hex);
    if (nextHex.isValid()) {
      const hsl = nextHex.toHsl();
      const hsv = nextHex.toHsv();
      switch(prop) {
        case 'fill': {
          const newFill = { h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: colorValue.a };
          setLayerFillColor({id: selected[0], fillColor: newFill});
          if (selectedType === 'Text') {
            setTextSettingsFillColor({fillColor: newFill});
          }
          break;
        }
        case 'stroke':
          setLayerStrokeColor({id: selected[0], strokeColor: { h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: colorValue.a }});
          break;
        case 'shadow':
          setLayerShadowColor({id: selected[0], shadowColor: { h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: colorValue.a }});
          break;
      }
    } else {
      setHex(tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex());
    }
  };

  const handleSwatchClick = (bounding: DOMRect): void => {
    if (!enabledValue) {
      switch(prop) {
        case 'fill':
          enableLayerFill({id: selected[0]});
          break;
        case 'stroke':
          enableLayerStroke({id: selected[0]});
          break;
        case 'shadow':
          enableLayerShadow({id: selected[0]});
          break;
      }
    }
    if (!colorEditorOpen) {
      openColorEditor({
        color: color,
        prop: prop,
        layer: selected[0],
        x: bounding.x,
        y: bounding.y - (bounding.height - 10) // 2 (swatch drop shadow) + 8 (top-padding)
      });
    }
  };

  return (
    <SidebarSectionRow alignItems='center'>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarSwatch
          isActive={colorEditorOpen}
          style={{
            background: tinyColor(color).toHslString()
          }}
          onClick={handleSwatchClick}
          bottomLabel='Color' />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={hex}
          onChange={handleHexChange}
          onSubmit={handleHexSubmit}
          submitOnBlur
          disabled={selected.length > 1 || selected.length === 0 || !enabledValue}
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
          disabled={selected.length > 1 || selected.length === 0 || !enabledValue}
          bottomLabel={'Opacity'} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

const mapStateToProps = (state: RootState, ownProps: ColorInputProps) => {
  const { layer, colorEditor } = state;
  const layerItem = layer.present.byId[layer.present.selected[0]];
  const style = (() => {
    switch(ownProps.prop) {
      case 'fill':
        return layerItem.style.fill;
      case 'stroke':
        return layerItem.style.stroke;
      case 'shadow':
        return layerItem.style.shadow;
    }
  })();
  const enabled = style.enabled;
  const selected = layer.present.selected;
  const selectedType = layer.present.selected.length === 1 ? layer.present.byId[layer.present.selected[0]].type : null;
  const colorValue = style.color;
  const colorEditorOpen = colorEditor.isOpen;
  return { enabled, selected, selectedType, colorValue, colorEditorOpen };
};

export default connect(
  mapStateToProps,
  {
    setLayerFillColor,
    setLayerStrokeColor,
    setLayerShadowColor,
    enableLayerFill,
    enableLayerStroke,
    enableLayerShadow,
    openColorEditor,
    setTextSettingsFillColor,
  }
)(FillColorInput);