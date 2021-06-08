import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedInnerWidth } from '../store/selectors/layer';
import { setLayersWidthThunk } from '../store/actions/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const WidthInput = (): ReactElement => {
  const formControlRef = useRef<HTMLInputElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const width = useSelector((state: RootState) => getSelectedInnerWidth(state));
  // const disabled = useSelector((state: RootState) => state.layer.present.selected.some((id) => state.layer.present.byId[id].type === 'Text'));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (evaluation: any): void => {
    dispatch(setLayersWidthThunk({layers: selected, width: evaluation}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-y'
      value={width}
      size='small'
      right={<Form.Text>W</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus
      disabled={false} />
  );
}

export default WidthInput;