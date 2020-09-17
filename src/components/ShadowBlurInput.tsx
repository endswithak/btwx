import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersShadowBlurPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersShadowBlur } from '../store/actions/layer';

interface ShadowBlurInputProps {
  shadowBlurValue?: number | 'multi';
  selected?: string[];
  disabled: boolean;
  setLayersShadowBlur?(payload: SetLayersShadowBlurPayload): LayerTypes;
}

const ShadowBlurInput = (props: ShadowBlurInputProps): ReactElement => {
  const { selected, shadowBlurValue, disabled, setLayersShadowBlur } = props;
  const [shadowBlur, setShadowBlur] = useState(shadowBlurValue !== 'multi' ? Math.round(shadowBlurValue) : shadowBlurValue);

  useEffect(() => {
    setShadowBlur(shadowBlurValue !== 'multi' ? Math.round(shadowBlurValue) : shadowBlurValue);
  }, [shadowBlurValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setShadowBlur(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      const nextBlur = mexp.eval(`${shadowBlur}`) as any;
      if (nextBlur !== shadowBlurValue) {
        setLayersShadowBlur({layers: selected, shadowBlur: Math.round(nextBlur)});
        setShadowBlur(Math.round(nextBlur));
      } else {
        setShadowBlur(shadowBlurValue !== 'multi' ? Math.round(shadowBlurValue) : shadowBlurValue);
      }
    } catch(error) {
      setShadowBlur(shadowBlurValue !== 'multi' ? Math.round(shadowBlurValue) : shadowBlurValue);
    }
  }

  return (
    <SidebarInput
      value={shadowBlur}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      bottomLabel={'Blur'}
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
  const shadowBlurValues = layerItems.reduce((result: number[], current: em.Shape | em.Image | em.Text) => {
    return [...result, current.style.shadow.blur];
  }, []);
  const shadowBlurValue = shadowBlurValues.every((shadowBlur: number) => shadowBlur === shadowBlurValues[0]) ? shadowBlurValues[0] : 'multi';
  const disabled = !layerItems.every((layerItem) => layerItem.style.shadow.enabled);
  return { selected, shadowBlurValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersShadowBlur }
)(ShadowBlurInput);