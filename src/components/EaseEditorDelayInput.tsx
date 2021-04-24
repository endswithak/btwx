import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersTweenDelay } from '../store/actions/layer';
import { getSelectedTweensDelay, getSelectedTweensLongestDuration, getSelectedTweensLongestRepeat } from '../store/selectors/layer';
import { MAX_TWEEN_DURATION } from '../constants';
import MathFormGroup from './MathFormGroup';

const EaseEditorDelayInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const delay = useSelector((state: RootState) => getSelectedTweensDelay(state));
  const longestDuration = useSelector((state: RootState) => getSelectedTweensLongestDuration(state));
  const longestRepeat = useSelector((state: RootState) => getSelectedTweensLongestRepeat(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newDelay: any): void => {
    if (((longestDuration + (longestDuration * longestRepeat)) + newDelay) > MAX_TWEEN_DURATION) {
      let currentDelay = newDelay;
      while((((longestDuration + (longestDuration * longestRepeat)) + currentDelay) > MAX_TWEEN_DURATION) && currentDelay > 0) {
        currentDelay = Math.round(((currentDelay - 0.01) + Number.EPSILON) * 100) / 100;
        newDelay = currentDelay;
      }
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
      // max={MAX_TWEEN_DURATION - longestDuration}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur />
  );
}

export default EaseEditorDelayInput;