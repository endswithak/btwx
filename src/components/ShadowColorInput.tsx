import paper from 'paper';
import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import chroma from 'chroma-js';
// import SidebarInput from './SidebarInput';
// import SidebarCheckbox from './SidebarCheckbox';
// import SidebarSectionRow from './SidebarSectionRow';
// import SidebarSectionColumn from './SidebarSectionColumn';
// import SidebarSwatch from './SidebarSwatch';
import { RootState } from '../store/reducers';
import { EnableLayerShadowPayload, DisableLayerShadowPayload, SetLayerShadowColorPayload, SetLayerShadowBlurPayload, SetLayerShadowXOffsetPayload, SetLayerShadowYOffsetPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerShadow, disableLayerShadow, setLayerShadowColor, setLayerShadowBlur, setLayerShadowXOffset, setLayerShadowYOffset } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import ColorInput from './ColorInput';

interface ShadowColorInputProps {
  shadow?: em.Shadow;
  shadowOpacity?: number;
  selected: string[];
  enableLayerShadow?(payload: EnableLayerShadowPayload): LayerTypes;
  disableLayerShadow?(payload: DisableLayerShadowPayload): LayerTypes;
  setLayerShadowColor?(payload: SetLayerShadowColorPayload): LayerTypes;
  setLayerShadowBlur?(payload: SetLayerShadowBlurPayload): LayerTypes;
  setLayerShadowXOffset?(payload: SetLayerShadowXOffsetPayload): LayerTypes;
  setLayerShadowYOffset?(payload: SetLayerShadowYOffsetPayload): LayerTypes;
}

const ShadowColorInput = (props: ShadowColorInputProps): ReactElement => {
  const { shadow, shadowOpacity, selected, enableLayerShadow, disableLayerShadow, setLayerShadowColor, setLayerShadowBlur, setLayerShadowXOffset, setLayerShadowYOffset } = props;
  const [enabled, setEnabled] = useState<boolean>(shadow.enabled);
  const [color, setColor] = useState<string>(chroma(shadow.color).alpha(1).hex());
  const [opacity, setOpacity] = useState<number | string>(shadowOpacity);
  const [swatchColor, setSwatchColor] = useState<string>(shadow.color);

  useEffect(() => {
    setEnabled(shadow.enabled);
    setColor(chroma(shadow.color).alpha(1).hex());
    setOpacity(shadowOpacity);
    setSwatchColor(shadow.color);
  }, [shadow, selected]);

  const handleOpacityChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  const handleColorChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setColor(target.value);
  };

  const handleOpacitySubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    try {
      let nextOpacity = evaluate(`${opacity}`);
      if (nextOpacity !== shadowOpacity) {
        if (nextOpacity > 100) {
          nextOpacity = 100;
        }
        if (nextOpacity < 0) {
          nextOpacity = 0;
        }
        const paperLayer = getPaperLayer(selected[0]);
        const newColor = chroma(color).alpha(evaluate(`${nextOpacity} / 100`)).hex();
        paperLayer.shadowColor = new paper.Color(newColor);
        setLayerShadowColor({id: selected[0], shadowColor: newColor});
      }
    } catch(error) {
      setOpacity(shadowOpacity);
    }
  }

  const handleColorSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (chroma.valid(color)) {
      const paperLayer = getPaperLayer(selected[0]);
      const nextShadowColor = chroma(color).alpha(shadowOpacity / 100).hex();
      paperLayer.shadowColor = new paper.Color(nextShadowColor);
      setLayerShadowColor({id: selected[0], shadowColor: nextShadowColor});
    } else {
      setColor(chroma(shadow.color).alpha(1).hex());
    }
  };

  const handleSwatchChange = (editorColor: string) => {
    setColor(chroma(editorColor).alpha(1).hex());
    setOpacity(chroma(editorColor).alpha() * 100);
    setSwatchColor(editorColor);
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.shadowColor = new paper.Color(editorColor);
  };

  const handleSwatchClick = (): void => {
    if (!enabled) {
      const paperLayer = getPaperLayer(selected[0]);
      enableLayerShadow({id: selected[0]});
      paperLayer.shadowColor = new paper.Color(shadow.color);
      paperLayer.shadowBlur = shadow.blur;
      paperLayer.shadowOffset = new paper.Point(shadow.offset.x, shadow.offset.y);
    }
  };

  return (
    <ColorInput
      layer={selected[0]}
      colorValue={color}
      swatchColorValue={swatchColor}
      prop='shadowColor'
      opacityValue={opacity}
      onColorChange={handleColorChange}
      onColorSubmit={handleColorSubmit}
      onOpacityChange={handleOpacityChange}
      onOpacitySubmit={handleOpacitySubmit}
      onSwatchChange={handleSwatchChange}
      onSwatchClick={handleSwatchClick}
      disabled={selected.length > 1 || selected.length === 0 || !enabled} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const shadow = layer.present.byId[layer.present.selected[0]].style.shadow;
  const shadowOpacity = chroma(shadow.color).alpha() * 100;
  return { selected, shadow, shadowOpacity };
};

export default connect(
  mapStateToProps,
  { enableLayerShadow, disableLayerShadow, setLayerShadowColor, setLayerShadowBlur, setLayerShadowXOffset, setLayerShadowYOffset }
)(ShadowColorInput);