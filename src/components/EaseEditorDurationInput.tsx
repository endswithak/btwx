import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerTweenDuration } from '../store/actions/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const EaseEditorDurationInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const duration = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].duration : null);
  const delay = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].delay : null);
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newDuration: any): void => {
    if (newDuration + delay > 10) {
      const diff = (newDuration + delay) - 10;
      newDuration = newDuration - diff;
    }
    if (newDuration < 0.04) {
      newDuration = 0.04;
    }
    dispatch(setLayerTweenDuration({id: id, duration: newDuration}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-ee-duration'
      value={duration}
      size='small'
      label='Duration'
      min={0.04}
      max={10 - delay}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur />
  );
}

export default EaseEditorDurationInput;