import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersTweenRepeat } from '../store/actions/layer';
import { getSelectedTweensRepeat, getSelectedTweensLongestDuration, getSelectedTweensLongestDelay } from '../store/selectors/layer';
import { MAX_TWEEN_DURATION } from '../constants';
import MathFormGroup from './MathFormGroup';
import EaseEditorYoyoInput from './EaseEditorYoyoInput';

const EaseEditorRepeatInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const repeat = useSelector((state: RootState) => getSelectedTweensRepeat(state));
  const longestDuration = useSelector((state: RootState) => getSelectedTweensLongestDuration(state));
  const longestDelay = useSelector((state: RootState) => getSelectedTweensLongestDelay(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newRepeat: any): void => {
    if ((longestDuration * newRepeat) + longestDelay > MAX_TWEEN_DURATION) {
      const diff = ((longestDuration * newRepeat) + longestDelay) - MAX_TWEEN_DURATION;
      newRepeat = newRepeat - diff;
    }
    if (newRepeat < 0) {
      newRepeat = 0;
    }
    dispatch(setLayersTweenRepeat({
      tweens: selectedTweens,
      repeat: newRepeat
    }));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-ee-repeat'
      value={repeat}
      size='small'
      label='Repeat'
      min={0}
      right={<EaseEditorYoyoInput />}
      rightReadOnly={false}
      // max={MAX_TWEEN_DURATION - longestDelay}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur />
  );
}

export default EaseEditorRepeatInput;