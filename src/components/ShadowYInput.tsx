import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersShadowYOffsetPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersShadowYOffset } from '../store/actions/layer';

interface ShadowYInputProps {
  shadowYOffsetValue?: number | 'multi';
  selected?: string[];
  disabled: boolean;
  setLayersShadowYOffset?(payload: SetLayersShadowYOffsetPayload): LayerTypes;
}

const ShadowYInput = (props: ShadowYInputProps): ReactElement => {
  const { selected, shadowYOffsetValue, disabled, setLayersShadowYOffset } = props;
  const [shadowYOffset, setShadowYOffset] = useState(shadowYOffsetValue !== 'multi' ? Math.round(shadowYOffsetValue) : shadowYOffsetValue);

  useEffect(() => {
    setShadowYOffset(shadowYOffsetValue !== 'multi' ? Math.round(shadowYOffsetValue) : shadowYOffsetValue);
  }, [shadowYOffsetValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setShadowYOffset(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      const newYOffset = mexp.eval(`${shadowYOffset}`) as any;
      if (newYOffset !== shadowYOffsetValue) {
        setLayersShadowYOffset({layers: selected, shadowYOffset: Math.round(newYOffset)});
        setShadowYOffset(Math.round(newYOffset));
      } else {
        setShadowYOffset(shadowYOffsetValue !== 'multi' ? Math.round(shadowYOffsetValue) : shadowYOffsetValue);
      }
    } catch(error) {
      setShadowYOffset(shadowYOffsetValue !== 'multi' ? Math.round(shadowYOffsetValue) : shadowYOffsetValue);
    }
  }

  return (
    <SidebarInput
      value={shadowYOffset}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      bottomLabel={'Y'}
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
  const shadowYOffsetValues = layerItems.reduce((result: number[], current: em.Shape | em.Image | em.Text) => {
    return [...result, current.style.shadow.offset.y];
  }, []);
  const shadowYOffsetValue = shadowYOffsetValues.every((shadowYOffset: number) => shadowYOffset === shadowYOffsetValues[0]) ? shadowYOffsetValues[0] : 'multi';
  const disabled = !layerItems.every((layerItem) => layerItem.style.shadow.enabled);
  return { selected, shadowYOffsetValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersShadowYOffset }
)(ShadowYInput);