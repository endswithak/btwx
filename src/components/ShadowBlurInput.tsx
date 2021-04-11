import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedShadowEnabled, getSelectedShadowBlur } from '../store/selectors/layer';
import { setLayersShadowBlur } from '../store/actions/layer';
import MathFormGroup from './MathFormGroup';

const ShadowBlurInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const shadowBlur = useSelector((state: RootState) => getSelectedShadowBlur(state));
  const disabled = useSelector((state: RootState) => !selectedShadowEnabled(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newBlur: any): void => {
    dispatch(setLayersShadowBlur({layers: selected, shadowBlur: newBlur}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-shadow-blur'
      value={shadowBlur}
      disabled={disabled}
      size='small'
      min={0}
      label='Blur'
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default ShadowBlurInput;