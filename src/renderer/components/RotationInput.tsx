/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedRotation } from '../store/selectors/layer';
import { setLayersRotationThunk } from '../store/actions/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const RotationInput = (): ReactElement => {
  const formControlRef = useRef<HTMLInputElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const disabled = useSelector((state: RootState) => state.layer.present.selected.some((id) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Artboard'));
  const rotation = useSelector((state: RootState) => getSelectedRotation(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (nextRotation: any): void => {
    if (nextRotation === 360 || nextRotation === -360) {
      nextRotation = 0;
    }
    dispatch(setLayersRotationThunk({layers: selected, rotation: nextRotation}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      disabled={disabled}
      controlId='control-rotation'
      value={rotation}
      size='small'
      max={360}
      min={-360}
      right={<Form.Text>°</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default RotationInput;