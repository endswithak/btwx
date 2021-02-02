import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedInnerHeight } from '../store/selectors/layer';
import { setLayersHeightThunk } from '../store/actions/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const HeightInput = (): ReactElement => {
  const formControlRef = useRef<HTMLInputElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const height = useSelector((state: RootState) => getSelectedInnerHeight(state));
  const disabled = useSelector((state: RootState) => state.layer.present.selected.some((id) => state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Line' || state.layer.present.byId[id].type === 'Text'));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (evaluation: any): void => {
    dispatch(setLayersHeightThunk({layers: selected, height: evaluation}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-y'
      value={height}
      size='small'
      right={<Form.Text>H</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus
      disabled={disabled} />
  );
}

export default HeightInput;