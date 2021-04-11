import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersFontSizeThunk } from '../store/actions/layer';
import { getSelectedFontSize } from '../store/selectors/layer';
import { setTextSettingsFontSize } from '../store/actions/textSettings';
import MathFormGroup from './MathFormGroup';

const FontSizeInput = (): ReactElement => {
  const formControlRef = useRef<HTMLInputElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const fontSize = useSelector((state: RootState) => getSelectedFontSize(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newFontSize: any): void => {
    dispatch(setLayersFontSizeThunk({layers: selected, fontSize: newFontSize}));
    dispatch(setTextSettingsFontSize({fontSize: newFontSize}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-font-size'
      value={fontSize}
      size='small'
      min={1}
      onSubmitSuccess={handleSubmitSuccess}
      canvasAutoFocus
      submitOnBlur
      label='Size' />
  );
}

export default FontSizeInput;