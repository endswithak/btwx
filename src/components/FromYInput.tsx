import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedFromY } from '../store/selectors/layer';
import { setLinesFromYThunk } from '../store/actions/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const FromYInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const y = useSelector((state: RootState) => getSelectedFromY(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newY: any): void => {
    dispatch(setLinesFromYThunk({layers: selected, y: newY}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-from-y'
      value={y}
      size='small'
      right={<Form.Text>Y</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default FromYInput;