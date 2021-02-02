import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedShadowEnabled, getSelectedShadowYOffset } from '../store/selectors/layer';
import { setLayersShadowYOffset } from '../store/actions/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const ShadowYInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const y = useSelector((state: RootState) => getSelectedShadowYOffset(state));
  const disabled = useSelector((state: RootState) => !selectedShadowEnabled(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newY: any): void => {
    dispatch(setLayersShadowYOffset({layers: selected, shadowYOffset: newY}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-shadow-y-offset'
      disabled={disabled}
      value={y}
      size='small'
      label='Offset'
      right={<Form.Text>Y</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default ShadowYInput;