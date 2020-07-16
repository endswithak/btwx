import paper from 'paper';
import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import { RootState } from '../store/reducers';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import { EnableLayerStrokePayload, SetLayerStrokeGradientPayload, SetLayerStrokeColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerStroke, setLayerStrokeGradient, setLayerStrokeColor } from '../store/actions/layer';
import { OpenStrokeColorEditorPayload, StrokeColorEditorTypes } from '../store/actionTypes/strokeColorEditor';
import { openStrokeColorEditor } from '../store/actions/strokeColorEditor';
import tinyColor from 'tinycolor2';

interface StrokeColorInputProps {
  strokeEnabled: boolean;
  selected: string[];
  selectedType?: em.LayerType;
  colorValue?: em.Color;
  strokeColorEditorOpen?: boolean;
  enableLayerStroke?(payload: EnableLayerStrokePayload): LayerTypes;
  setLayerStrokeColor?(payload: SetLayerStrokeColorPayload): LayerTypes;
  setLayerStrokeGradient?(payload: SetLayerStrokeGradientPayload): LayerTypes;
  openStrokeColorEditor?(payload: OpenStrokeColorEditorPayload): StrokeColorEditorTypes;
}

const StrokeColorInput = (props: StrokeColorInputProps): ReactElement => {
  const { strokeEnabled, selected, selectedType, colorValue, strokeColorEditorOpen, enableLayerStroke, openStrokeColorEditor, setLayerStrokeColor } = props;
  const [enabled, setEnabled] = useState<boolean>(strokeEnabled);
  const [color, setColor] = useState(colorValue);
  const [opacity, setOpacity] = useState<number | string>(colorValue.a * 100);
  const [hex, setHex] = useState(tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex());

  useEffect(() => {
    setEnabled(strokeEnabled);
    setColor(colorValue);
    setOpacity(colorValue.a * 100);
    setHex(tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex());
  }, [colorValue, selected, strokeEnabled]);

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
        setLayerStrokeColor({id: selected[0], strokeColor: {...color, a: nextOpacity / 100}});
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
      setLayerStrokeColor({id: selected[0], strokeColor: { h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: colorValue.a }});
    } else {
      setHex(tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex());
    }
  };

  const handleSwatchClick = (bounding: DOMRect): void => {
    if (!enabled) {
      enableLayerStroke({id: selected[0]});
    }
    if (!strokeColorEditorOpen) {
      openStrokeColorEditor({
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
          isActive={strokeColorEditorOpen}
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
  const { layer, strokeColorEditor } = state;
  const stroke = layer.present.byId[layer.present.selected[0]].style.stroke;
  const strokeEnabled = stroke.enabled;
  const selected = layer.present.selected;
  const selectedType = layer.present.selected.length === 1 ? layer.present.byId[layer.present.selected[0]].type : null;
  const colorValue = stroke.color;
  const strokeColorEditorOpen = strokeColorEditor.isOpen;
  return { strokeEnabled, selected, selectedType, colorValue, strokeColorEditorOpen };
};

export default connect(
  mapStateToProps,
  {
    enableLayerStroke,
    setLayerStrokeGradient,
    openStrokeColorEditor,
    setLayerStrokeColor
  }
)(StrokeColorInput);