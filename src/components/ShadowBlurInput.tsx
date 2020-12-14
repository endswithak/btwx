import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { selectedShadowEnabled, getSelectedShadowBlur } from '../store/selectors/layer';
import { setLayersShadowBlur } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const ShadowBlurInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const shadowBlurValue = useSelector((state: RootState) => getSelectedShadowBlur(state));
  const disabled = useSelector((state: RootState) => !selectedShadowEnabled(state));
  const [shadowBlur, setShadowBlur] = useState(shadowBlurValue !== 'multi' ? Math.round(shadowBlurValue) : shadowBlurValue);
  const dispatch = useDispatch();

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
        dispatch(setLayersShadowBlur({layers: selected, shadowBlur: Math.round(nextBlur)}));
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

export default ShadowBlurInput;