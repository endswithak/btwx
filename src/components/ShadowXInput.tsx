import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { selectedShadowEnabled, getSelectedShadowXOffset } from '../store/selectors/layer';
import { setLayersShadowXOffset } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const ShadowXInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const shadowXOffsetValue = useSelector((state: RootState) => getSelectedShadowXOffset(state));
  const disabled = useSelector((state: RootState) => !selectedShadowEnabled(state));
  const [shadowXOffset, setShadowXOffset] = useState(shadowXOffsetValue !== 'multi' ? Math.round(shadowXOffsetValue) : shadowXOffsetValue);
  const dispatch = useDispatch();

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
        dispatch(setLayersShadowXOffset({layers: selected, shadowXOffset: Math.round(newXOffset)}));
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

export default ShadowXInput;