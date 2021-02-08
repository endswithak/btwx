import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersObliqueThunk } from '../store/actions/layer';
import { getSelectedOblique } from '../store/selectors/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const ObliqueInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const oblique = useSelector((state: RootState) => getSelectedOblique(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newOblique: any): void => {
    dispatch(setLayersObliqueThunk({layers: selected, oblique: newOblique}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-oblique'
      value={oblique}
      size='small'
      max={14}
      min={0}
      label='Oblique'
      right={<Form.Text>°</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default ObliqueInput;