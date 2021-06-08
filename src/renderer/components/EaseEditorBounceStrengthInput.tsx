import React, { ReactElement, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersCustomBounceTweenStrength } from '../store/actions/layer';
import { getSelectedCustomBounceTweensStrength } from '../store/selectors/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

interface EaseEditorBounceStrengthInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorBounceStrengthInput = (props: EaseEditorBounceStrengthInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  // const id = useSelector((state: RootState) => state.easeEditor.tween);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const strength = useSelector((state: RootState) => getSelectedCustomBounceTweensStrength(state));
  // const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'customBounce' : true);
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newStrength: any): void => {
    if (newStrength > 1) {
      newStrength = 1;
    }
    if (newStrength < 0) {
      newStrength = 0;
    }
    dispatch(setLayersCustomBounceTweenStrength({
      tweens: selectedTweens,
      strength: newStrength
    }));
  }

  const handleFocus = (e: any): void => {
    setParamInfo({
      type: 'Number',
      description: 'A number between 0 and 1 that determines how “bouncy” the ease is.'
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
      controlId='control-ee-bounce-strength'
      value={strength}
      // disabled={disabled}
      onFocus={handleFocus}
      onBlur={handleBlur}
      size='small'
      label='Strength'
      min={0}
      max={1}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur />
  );
}

export default EaseEditorBounceStrengthInput;