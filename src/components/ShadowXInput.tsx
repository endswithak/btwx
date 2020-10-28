import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
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
  const [shadowXOffset, setShadowXOffset] = useState(shadowXOffsetValue !== 'multi' ? Math.round(shadowXOffsetValue) : shadowXOffsetValue);

  useEffect(() => {
    setShadowXOffset(shadowXOffsetValue !== 'multi' ? Math.round(shadowXOffsetValue) : shadowXOffsetValue);
  }, [shadowXOffsetValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setShadowXOffset(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      const newXOffset = mexp.eval(`${shadowXOffset}`) as any;
      if (newXOffset !== shadowXOffsetValue) {
        setLayersShadowXOffset({layers: selected, shadowXOffset: Math.round(newXOffset)});
        setShadowXOffset(Math.round(newXOffset));
      } else {
        setShadowXOffset(shadowXOffsetValue !== 'multi' ? Math.round(shadowXOffsetValue) : shadowXOffsetValue);
      }
    } catch(error) {
      setShadowXOffset(shadowXOffsetValue !== 'multi' ? Math.round(shadowXOffsetValue) : shadowXOffsetValue);
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
  const layerItems: (Btwx.Shape | Btwx.Image | Btwx.Text)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const shadowXOffsetValues = layerItems.reduce((result: number[], current: Btwx.Shape | Btwx.Image | Btwx.Text) => {
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