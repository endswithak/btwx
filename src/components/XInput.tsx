/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersX } from '../store/actions/layer';
import { getSelectedX } from '../store/selectors/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const XInput = (): ReactElement => {
  const formControlRef = useRef<HTMLInputElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const x = useSelector((state: RootState) => getSelectedX(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (evaluation: any): void => {
    dispatch(setLayersX({layers: selected, x: evaluation}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-x'
      value={x}
      size='small'
      right={<Form.Text>X</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default XInput;