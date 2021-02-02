import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedToX } from '../store/selectors/layer';
import { setLinesToXThunk } from '../store/actions/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const ToXInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const x = useSelector((state: RootState) => getSelectedToX(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (nextX: any): void => {
    dispatch(setLinesToXThunk({layers: selected, x: nextX}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-to-x'
      value={x}
      size='small'
      right={<Form.Text>X</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default ToXInput;