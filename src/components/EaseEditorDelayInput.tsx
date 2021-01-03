import React, { ReactElement, useEffect, useState } from 'react';
import mexp from 'math-expression-evaluator';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MotionPathHelper } from 'gsap/MotionPathHelper';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { RootState } from '../store/reducers';
import { setLayerTweenDelay } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

gsap.registerPlugin(CustomEase, MotionPathPlugin, MotionPathHelper, DrawSVGPlugin);

const EaseEditorDelayInput = (): ReactElement => {
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const durationValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].duration : null);
  const delayValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].delay : null);
  const [delay, setDelay] = useState(delayValue);
  const dispatch = useDispatch();

  const handleDelayChange = (e: any): void => {
    const target = e.target;
    setDelay(target.value);
  };

  const handleDelaySubmit = (e: any): void => {
    try {
      const delayRounded = Math.round((mexp.eval(`${delay}`) as any + Number.EPSILON) * 100) / 100
      if (delayRounded !== delayValue) {
        let newDelay = delayRounded;
        if (delayRounded + durationValue > 10) {
          const diff = (delayRounded + durationValue) - 10;
          newDelay = delayRounded - diff;
        }
        if (delayRounded < 0) {
          newDelay = 0;
        }
        dispatch(setLayerTweenDelay({id: id, delay: newDelay}));
        setDelay(newDelay);
      } else {
        setDelay(delayValue);
      }
    } catch(error) {
      setDelay(delayValue);
    }
  }

  useEffect(() => {
    setDelay(delayValue);
  }, [delayValue]);

  return (
    <SidebarInput
      value={delay}
      onChange={handleDelayChange}
      onSubmit={handleDelaySubmit}
      submitOnBlur
      bottomLabel='Delay' />
  );
}

export default EaseEditorDelayInput;