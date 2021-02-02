import React, { ReactElement, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase } from 'gsap/EasePack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerRoughTweenStrength } from '../store/actions/layer';
import MathFormGroup from './MathFormGroup';

gsap.registerPlugin(CustomEase, RoughEase);

interface EaseEditorRoughStrengthInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorRoughStrengthInput = (props: EaseEditorRoughStrengthInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const strength = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough.strength : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'rough' : true);
  const roughTween = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough : null);
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newStrength: any): void => {
    if (newStrength < 0) {
      newStrength = 0;
    }
    dispatch(setLayerRoughTweenStrength({
      id: id,
      strength: newStrength,
      ref: CustomEase.getSVGData(`rough({
        clamp: ${roughTween.clamp},
        points: ${roughTween.points},
        randomize: ${roughTween.randomize},
        strength: ${newStrength},
        taper: ${roughTween.taper},
        template: ${roughTween.template}
      })`, {
        width: 400,
        height: 400
      })
    }));
  }

  const handleFocus = (e: any): void => {
    setParamInfo({
      type: 'Number',
      description: 'Controls how far from the template ease the points are allowed to wander (a small number like 0.1 keeps it very close to the template ease whereas a larger number like 5 creates much bigger variations).'
    });
  }

  const handleBlur = (e: any): void => {
    setParamInfo(null);
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-ee-rough-strength'
      value={strength}
      disabled={disabled}
      size='small'
      label='Strength'
      min={0}
      onSubmitSuccess={handleSubmitSuccess}
      onBlur={handleBlur}
      onFocus={handleFocus}
      submitOnBlur />
  );
}

export default EaseEditorRoughStrengthInput;