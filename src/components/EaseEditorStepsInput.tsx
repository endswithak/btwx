import React, { ReactElement, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersStepsTweenSteps } from '../store/actions/layer';
import { getSelectedStepTweensSteps } from '../store/selectors/layer';
import MathFormGroup from './MathFormGroup';

interface EaseEditorStepsInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorStepsInput = (props: EaseEditorStepsInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  // const id = useSelector((state: RootState) => state.easeEditor.tween);
  const steps = useSelector((state: RootState) => getSelectedStepTweensSteps(state));
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  // const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'steps' : true);
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newSteps: any): void => {
    if (newSteps < 0) {
      newSteps = 0;
    }
    dispatch(setLayersStepsTweenSteps({
      tweens: selectedTweens,
      steps: newSteps
    }));
  }

  const handleFocus = (e: any): void => {
    setParamInfo({
      type: 'Number',
      description: 'Ammount of steps the transition should take.'
    });
  }

  const handleBlur = (e: any): void => {
    setParamInfo(null);
  }

  useEffect(() => {
    if (formControlRef.current) {
      formControlRef.current.focus();
      formControlRef.current.select();
    }
  }, []);

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-ee-steps'
      value={steps}
      // disabled={disabled}
      size='small'
      label='Points'
      min={0}
      onSubmitSuccess={handleSubmitSuccess}
      onBlur={handleBlur}
      onFocus={handleFocus}
      submitOnBlur />
  );
}

export default EaseEditorStepsInput;