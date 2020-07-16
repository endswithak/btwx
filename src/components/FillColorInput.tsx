import paper from 'paper';
import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import { RootState } from '../store/reducers';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import { getPaperLayer } from '../store/selectors/layer';
import { EnableLayerFillPayload, SetLayerFillGradientPayload, SetLayerFillColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerFill, setLayerFillGradient, setLayerFillColor } from '../store/actions/layer';
import { OpenFillColorEditorPayload, FillColorEditorTypes } from '../store/actionTypes/fillColorEditor';
import { openFillColorEditor } from '../store/actions/fillColorEditor';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import tinyColor from 'tinycolor2';

interface FillColorInputProps {
  fillEnabled: boolean;
  selected: string[];
  selectedType?: em.LayerType;
  colorValue?: em.Color;
  fillColorEditorOpen?: boolean;
  enableLayerFill?(payload: EnableLayerFillPayload): LayerTypes;
  setLayerFillColor?(payload: SetLayerFillColorPayload): LayerTypes;
  setLayerFillGradient?(payload: SetLayerFillGradientPayload): LayerTypes;
  openFillColorEditor?(payload: OpenFillColorEditorPayload): FillColorEditorTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
}

const FillColorInput = (props: FillColorInputProps): ReactElement => {
  const { fillEnabled, selected, selectedType, colorValue, fillColorEditorOpen, enableLayerFill, openFillColorEditor, setTextSettingsFillColor, setLayerFillColor } = props;
  const [enabled, setEnabled] = useState<boolean>(fillEnabled);
  const [color, setColor] = useState(colorValue);
  const [opacity, setOpacity] = useState<number | string>(colorValue.a * 100);
  const [hex, setHex] = useState(tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex());

  useEffect(() => {
    setEnabled(fillEnabled);
    setColor(colorValue);
    setOpacity(colorValue.a * 100);
    setHex(tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex());
  }, [colorValue, selected, fillEnabled]);

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
        setLayerFillColor({id: selected[0], fillColor: {...color, a: nextOpacity / 100}});
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
      setLayerFillColor({id: selected[0], fillColor: { h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: colorValue.a }});
    } else {
      setHex(tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex());
    }
  };

  const handleSwatchClick = (bounding: DOMRect): void => {
    if (!enabled) {
      enableLayerFill({id: selected[0]});
    }
    if (!fillColorEditorOpen) {
      openFillColorEditor({
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
          isActive={fillColorEditorOpen}
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
  const { layer, fillColorEditor } = state;
  const fill = layer.present.byId[layer.present.selected[0]].style.fill;
  const fillEnabled = fill.enabled;
  const selected = layer.present.selected;
  const selectedType = layer.present.selected.length === 1 ? layer.present.byId[layer.present.selected[0]].type : null;
  const colorValue = fill.color;
  const fillColorEditorOpen = fillColorEditor.isOpen;
  return { fillEnabled, selected, selectedType, colorValue, fillColorEditorOpen };
};

export default connect(
  mapStateToProps,
  {
    enableLayerFill,
    setLayerFillGradient,
    openFillColorEditor,
    setTextSettingsFillColor,
    setLayerFillColor
  }
)(FillColorInput);