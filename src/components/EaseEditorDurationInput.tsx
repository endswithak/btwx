import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersTweenDuration } from '../store/actions/layer';
import { getSelectedTweensDuration, getSelectedTweensLongestDelay } from '../store/selectors/layer';
import MathFormGroup from './MathFormGroup';

const EaseEditorDurationInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const duration = useSelector((state: RootState) => getSelectedTweensDuration(state));
  const longestDelay = useSelector((state: RootState) => getSelectedTweensLongestDelay(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newDuration: any): void => {
    if (newDuration + longestDelay > 10) {
      const diff = (newDuration + longestDelay) - 10;
      newDuration = newDuration - diff;
    }
    if (newDuration < 0.04) {
      newDuration = 0.04;
    }
    dispatch(setLayersTweenDuration({
      tweens: selectedTweens,
      duration: newDuration
    }));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-ee-duration'
      value={duration}
      size='small'
      label='Duration'
      min={0.04}
      max={10 - longestDelay}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur />
  );
}

export default EaseEditorDurationInput;