import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersPointY } from '../store/actions/layer';
import { getSelectedPointY } from '../store/selectors/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const PointYInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const y = useSelector((state: RootState) => getSelectedPointY(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newY: any): void => {
    dispatch(setLayersPointY({layers: selected, y: newY}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-point-y'
      value={y}
      size='small'
      // label='Point'
      right={<Form.Text>Y</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default PointYInput;