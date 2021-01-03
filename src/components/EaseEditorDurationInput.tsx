import React, { ReactElement, useEffect, useState } from 'react';
import mexp from 'math-expression-evaluator';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerTweenDuration } from '../store/actions/layer';
import SidebarInput from './SidebarInput';


const EaseEditorDurationInput = (): ReactElement => {
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const durationValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].duration : null);
  const delayValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].delay : null);
  const [duration, setDuration] = useState(durationValue);
  const dispatch = useDispatch();

  const handleDurationChange = (e: any): void => {
    const target = e.target;
    setDuration(target.value);
  };

  const handleDurationSubmit = (e: any): void => {
    try {
      const durationRounded = Math.round((mexp.eval(`${duration}`) as any + Number.EPSILON) * 100) / 100;
      if (durationRounded !== durationValue) {
        let newDuration = durationRounded;
        if (durationRounded + delayValue > 10) {
          const diff = (durationRounded + delayValue) - 10;
          newDuration = durationRounded - diff;
        }
        if (durationRounded < 0.04) {
          newDuration = 0.04;
        }
        dispatch(setLayerTweenDuration({id: id, duration: newDuration}));
        setDuration(newDuration);
      } else {
        setDuration(durationValue);
      }
    } catch(error) {
      setDuration(durationValue);
    }
  }

  useEffect(() => {
    setDuration(durationValue);
  }, [durationValue]);

  return (
    <SidebarInput
      value={duration}
      onChange={handleDurationChange}
      onSubmit={handleDurationSubmit}
      submitOnBlur
      bottomLabel='Duration' />
  );
}

export default EaseEditorDurationInput;