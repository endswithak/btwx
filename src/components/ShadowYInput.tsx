import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { selectedShadowEnabled, getSelectedShadowYOffset } from '../store/selectors/layer';
import { setLayersShadowYOffset } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const ShadowYInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const shadowYOffsetValue = useSelector((state: RootState) => getSelectedShadowYOffset(state));
  const disabled = useSelector((state: RootState) => !selectedShadowEnabled(state));
  const [shadowYOffset, setShadowYOffset] = useState(shadowYOffsetValue !== 'multi' ? Math.round(shadowYOffsetValue) : shadowYOffsetValue);
  const dispatch = useDispatch();

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
        dispatch(setLayersShadowYOffset({layers: selected, shadowYOffset: Math.round(newYOffset)}));
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

export default ShadowYInput;