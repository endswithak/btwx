import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersShadowXOffsetPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersShadowXOffset } from '../store/actions/layer';

interface ShadowXInputProps {
  shadowXOffsetValue?: number | 'multi';
  selected?: string[];
  disabled: boolean;
  setLayersShadowXOffset?(payload: SetLayersShadowXOffsetPayload): LayerTypes;
}

const ShadowXInput = (props: ShadowXInputProps): ReactElement => {
  const { selected, shadowXOffsetValue, disabled, setLayersShadowXOffset } = props;
  const [shadowXOffset, setShadowXOffset] = useState(shadowXOffsetValue);

  useEffect(() => {
    setShadowXOffset(shadowXOffsetValue);
  }, [shadowXOffsetValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setShadowXOffset(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      const newXOffset = evaluate(`${shadowXOffset}`);
      if (newXOffset !== shadowXOffsetValue && !isNaN(newXOffset)) {
        setLayersShadowXOffset({layers: selected, shadowXOffset: newXOffset});
        setShadowXOffset(newXOffset);
      } else {
        setShadowXOffset(shadowXOffsetValue);
      }
    } catch(error) {
      setShadowXOffset(shadowXOffsetValue);
    }
  }

  return (
    <SidebarInput
      value={shadowXOffset}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      bottomLabel={'X'}
      disabled={disabled} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: (em.Shape | em.Image | em.Text)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const shadowXOffsetValues = layerItems.reduce((result: number[], current: em.Shape | em.Image | em.Text) => {
    return [...result, current.style.shadow.offset.x];
  }, []);
  const shadowXOffsetValue = shadowXOffsetValues.every((shadowXOffset: number) => shadowXOffset === shadowXOffsetValues[0]) ? shadowXOffsetValues[0] : 'multi';
  const disabled = !layerItems.every((layerItem) => layerItem.style.shadow.enabled);
  return { selected, shadowXOffsetValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersShadowXOffset }
)(ShadowXInput);