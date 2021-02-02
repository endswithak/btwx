import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersPointX } from '../store/actions/layer';
import { getSelectedPointX } from '../store/selectors/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const PointXInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const x = useSelector((state: RootState) => getSelectedPointX(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newX: any): void => {
    dispatch(setLayersPointX({layers: selected, x: newX}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-point-x'
      value={x}
      size='small'
      label='Point'
      right={<Form.Text>X</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default PointXInput;