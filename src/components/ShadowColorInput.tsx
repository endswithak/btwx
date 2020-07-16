import paper from 'paper';
import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import { RootState } from '../store/reducers';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import { EnableLayerShadowPayload, SetLayerShadowColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerShadow, setLayerShadowColor } from '../store/actions/layer';
import { OpenShadowColorEditorPayload, ShadowColorEditorTypes } from '../store/actionTypes/shadowColorEditor';
import { openShadowColorEditor } from '../store/actions/shadowColorEditor';
import tinyColor from 'tinycolor2';

interface ShadowColorInputProps {
  shadowEnabled: boolean;
  selected: string[];
  selectedType?: em.LayerType;
  colorValue?: em.Color;
  shadowColorEditorOpen?: boolean;
  enableLayerShadow?(payload: EnableLayerShadowPayload): LayerTypes;
  setLayerShadowColor?(payload: SetLayerShadowColorPayload): LayerTypes;
  openShadowColorEditor?(payload: OpenShadowColorEditorPayload): ShadowColorEditorTypes;
}

const ShadowColorInput = (props: ShadowColorInputProps): ReactElement => {
  const { shadowEnabled, selected, selectedType, colorValue, shadowColorEditorOpen, enableLayerShadow, openShadowColorEditor, setLayerShadowColor } = props;
  const [enabled, setEnabled] = useState<boolean>(shadowEnabled);
  const [color, setColor] = useState(colorValue);
  const [opacity, setOpacity] = useState<number | string>(colorValue.a * 100);
  const [hex, setHex] = useState(tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex());

  useEffect(() => {
    setEnabled(shadowEnabled);
    setColor(colorValue);
    setOpacity(colorValue.a * 100);
    setHex(tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex());
  }, [colorValue, selected, shadowEnabled]);

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
        setLayerShadowColor({id: selected[0], shadowColor: {...color, a: nextOpacity / 100}});
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
      setLayerShadowColor({id: selected[0], shadowColor: { h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: colorValue.a }});
    } else {
      setHex(tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex());
    }
  };

  const handleSwatchClick = (bounding: DOMRect): void => {
    if (!enabled) {
      enableLayerShadow({id: selected[0]});
    }
    if (!shadowColorEditorOpen) {
      openShadowColorEditor({
        color: color,
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
          isActive={shadowColorEditorOpen}
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
          disabled={selected.length > 1 || selected.length === 0 || !enabled}
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
          disabled={selected.length > 1 || selected.length === 0 || !enabled}
          bottomLabel={'Opacity'} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, shadowColorEditor } = state;
  const shadow = layer.present.byId[layer.present.selected[0]].style.shadow;
  const shadowEnabled = shadow.enabled;
  const selected = layer.present.selected;
  const selectedType = layer.present.selected.length === 1 ? layer.present.byId[layer.present.selected[0]].type : null;
  const colorValue = shadow.color;
  const shadowColorEditorOpen = shadowColorEditor.isOpen;
  return { shadowEnabled, selected, selectedType, colorValue, shadowColorEditorOpen };
};

export default connect(
  mapStateToProps,
  {
    enableLayerShadow,
    openShadowColorEditor,
    setLayerShadowColor
  }
)(ShadowColorInput);