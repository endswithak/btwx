import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedFromX } from '../store/selectors/layer';
import { setLinesFromXThunk } from '../store/actions/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const FromXInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const x = useSelector((state: RootState) => getSelectedFromX(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newX: any): void => {
    dispatch(setLinesFromXThunk({layers: selected, x: newX}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-from-x'
      value={x}
      size='small'
      right={<Form.Text>X</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default FromXInput;