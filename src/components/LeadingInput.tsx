import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersLeadingThunk } from '../store/actions/layer';
import { getSelectedLeading } from '../store/selectors/layer';
import { setTextSettingsLeading } from '../store/actions/textSettings';
import MathFormGroup from './MathFormGroup';

const LeadingInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const leading = useSelector((state: RootState) => getSelectedLeading(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newLeading: any): void => {
    dispatch(setLayersLeadingThunk({layers: selected, leading: newLeading}));
    dispatch(setTextSettingsLeading({leading: newLeading}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-leading'
      value={leading}
      size='small'
      label='Leading'
      min={1}
      onSubmitSuccess={handleSubmitSuccess}
      canvasAutoFocus
      submitOnBlur />
  );
}

export default LeadingInput;