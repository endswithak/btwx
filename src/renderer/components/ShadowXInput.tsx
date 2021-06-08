import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedShadowEnabled, getSelectedShadowXOffset } from '../store/selectors/layer';
import { setLayersShadowXOffset } from '../store/actions/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const ShadowXInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const x = useSelector((state: RootState) => getSelectedShadowXOffset(state));
  const disabled = useSelector((state: RootState) => !selectedShadowEnabled(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newX: any): void => {
    dispatch(setLayersShadowXOffset({layers: selected, shadowXOffset: newX}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-shadow-x-offset'
      disabled={disabled}
      value={x}
      size='small'
      label='Offset'
      right={<Form.Text>X</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default ShadowXInput;