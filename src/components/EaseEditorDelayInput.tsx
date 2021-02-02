import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MotionPathHelper } from 'gsap/MotionPathHelper';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { RootState } from '../store/reducers';
import { setLayerTweenDelay } from '../store/actions/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

gsap.registerPlugin(CustomEase, MotionPathPlugin, MotionPathHelper, DrawSVGPlugin);

const EaseEditorDelayInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const duration = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].duration : null);
  const delay = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].delay : null);
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newDelay: any): void => {
    if (newDelay + duration > 10) {
      const diff = (newDelay + duration) - 10;
      newDelay = newDelay - diff;
    }
    if (newDelay < 0) {
      newDelay = 0;
    }
    dispatch(setLayerTweenDelay({id: id, delay: newDelay}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-ee-delay'
      value={delay}
      size='small'
      label='Delay'
      min={0}
      max={10 - duration}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur />
  );
}

export default EaseEditorDelayInput;