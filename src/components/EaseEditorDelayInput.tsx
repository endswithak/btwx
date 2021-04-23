import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersTweenDelay } from '../store/actions/layer';
import { getSelectedTweensDelay, getSelectedTweensLongestDuration } from '../store/selectors/layer';
import { MAX_TWEEN_DURATION } from '../constants';
import MathFormGroup from './MathFormGroup';

const EaseEditorDelayInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const delay = useSelector((state: RootState) => getSelectedTweensDelay(state));
  const longestDuration = useSelector((state: RootState) => getSelectedTweensLongestDuration(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newDelay: any): void => {
    if (newDelay + longestDuration > MAX_TWEEN_DURATION) {
      const diff = (newDelay + longestDuration) - MAX_TWEEN_DURATION;
      newDelay = newDelay - diff;
    }
    if (newDelay < 0) {
      newDelay = 0;
    }
    dispatch(setLayersTweenDelay({
      tweens: selectedTweens,
      delay: newDelay
    }));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-ee-delay'
      value={delay}
      size='small'
      label='Delay'
      min={0}
      max={MAX_TWEEN_DURATION - longestDuration}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur />
  );
}

export default EaseEditorDelayInput;