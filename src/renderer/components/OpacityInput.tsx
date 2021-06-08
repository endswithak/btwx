import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedOpacity } from '../store/selectors/layer';
import { setLayersOpacity } from '../store/actions/layer';
import PercentageFormGroup from './PercentageFormGroup';

const OpacityInput = (): ReactElement => {
  const inputControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const opacity = useSelector((state: RootState) => getSelectedOpacity(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (nextOpacity: any): void => {
    dispatch(setLayersOpacity({layers: selected, opacity: nextOpacity}));
  }

  return (
    <PercentageFormGroup
      controlId='control-opacity'
      value={opacity}
      ref={inputControlRef}
      submitOnBlur
      canvasAutoFocus
      size='small'
      onSubmitSuccess={handleSubmitSuccess}
      label='Opacity' />
  );
}

export default OpacityInput;