import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedToY } from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import { setLinesToYThunk } from '../store/actions/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const ToYInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const y = useSelector((state: RootState) => getSelectedToY(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (nextY: any): void => {
    dispatch(setLinesToYThunk({layers: selected, y: nextY}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-to-y'
      value={y}
      size='small'
      right={<Form.Text>Y</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default ToYInput;