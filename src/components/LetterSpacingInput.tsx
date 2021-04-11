import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersLetterSpacingThunk } from '../store/actions/layer';
import { getSelectedLetterSpacing } from '../store/selectors/layer';
import { setTextSettingsLetterSpacing } from '../store/actions/textSettings';
import MathFormGroup from './MathFormGroup';

const LetterSpacingInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const letterSpacing = useSelector((state: RootState) => getSelectedLetterSpacing(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newLetterSpacing: any): void => {
    dispatch(setLayersLetterSpacingThunk({layers: selected, letterSpacing: newLetterSpacing}));
    dispatch(setTextSettingsLetterSpacing({letterSpacing: newLetterSpacing}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-letter-spacing'
      value={letterSpacing}
      size='small'
      label='Tracking'
      min={0}
      onSubmitSuccess={handleSubmitSuccess}
      canvasAutoFocus
      submitOnBlur />
  );
}

export default LetterSpacingInput;