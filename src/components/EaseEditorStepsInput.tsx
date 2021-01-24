import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerStepsTweenSteps } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

interface EaseEditorStepsInputProps {
  setInputInfo(inputInfo: { type: string; description: string }): void;
}

const EaseEditorStepsInput = (props: EaseEditorStepsInputProps): ReactElement => {
  const { setInputInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const stepsValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].steps.steps : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'steps' : true);
  const [steps, setSteps] = useState(stepsValue);
  const dispatch = useDispatch();

  const handleStepsChange = (e: any): void => {
    const target = e.target;
    setSteps(target.value);
  };

  const handleStepsSubmit = (e: any): void => {
    try {
      const stepsRounded = Math.round(steps);
      if (stepsRounded !== stepsValue) {
        let newSteps = stepsRounded;
        if (stepsRounded < 0) {
          newSteps = 0;
        }
        dispatch(setLayerStepsTweenSteps({id: id, steps: newSteps}));
        setSteps(newSteps);
      } else {
        setSteps(stepsValue);
      }
    } catch(error) {
      setSteps(stepsValue);
    }
  }

  const handleFocus = () => {
    setInputInfo({
      type: 'Number',
      description: 'Ammount of steps the transition should take.'
    });
  }

  const handleBlur = () => {
    setInputInfo(null);
  }

  useEffect(() => {
    setSteps(stepsValue);
  }, [stepsValue]);

  return (
    <SidebarInput
      value={steps}
      disabled={disabled}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleStepsChange}
      onSubmit={handleStepsSubmit}
      submitOnBlur
      bottomLabel='Steps' />
  );
}

export default EaseEditorStepsInput;