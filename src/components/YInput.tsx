import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersY } from '../store/actions/layer';
import { getSelectedY } from '../store/selectors/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const YInput = (): ReactElement => {
  const formControlRef = useRef<HTMLInputElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const y = useSelector((state: RootState) => getSelectedY(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (evaluation: any): void => {
    dispatch(setLayersY({layers: selected, y: evaluation}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-y'
      value={y}
      size='small'
      right={<Form.Text>Y</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default YInput;