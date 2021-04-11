import React, { ReactElement, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase } from 'gsap/EasePack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersRoughTweenStrength } from '../store/actions/layer';
import { getSelectedRoughTweensStrength } from '../store/selectors/layer';
import MathFormGroup from './MathFormGroup';

gsap.registerPlugin(CustomEase, RoughEase);

interface EaseEditorRoughStrengthInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorRoughStrengthInput = (props: EaseEditorRoughStrengthInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const selectedTweensById = useSelector((state: RootState) => selectedTweens.reduce((result, current) => ({
    ...result,
    [current]: state.layer.present.tweens.byId[current]
  }), {}));
  const strength = useSelector((state: RootState) => getSelectedRoughTweensStrength(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newStrength: any): void => {
    if (newStrength < 0) {
      newStrength = 0;
    }
    dispatch(setLayersRoughTweenStrength({
      tweens: selectedTweens,
      strength: newStrength,
      ref: selectedTweens.reduce((result, current) => {
        const tweenItem = selectedTweensById[current];
        const roughProps = tweenItem.rough;
        return {
          ...result,
          [current]: CustomEase.getSVGData(`rough({
            clamp: ${roughProps.clamp},
            points: ${roughProps.points},
            randomize: ${roughProps.randomize},
            strength: ${newStrength},
            taper: ${roughProps.taper},
            template: ${roughProps.template}
          })`, {
            width: 400,
            height: 400
          })
        };
      }, {})
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
      // disabled={disabled}
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