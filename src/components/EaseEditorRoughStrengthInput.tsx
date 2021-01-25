import React, { ReactElement, useEffect, useState } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase } from 'gsap/EasePack';
import mexp from 'math-expression-evaluator';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerRoughTweenStrength } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

gsap.registerPlugin(CustomEase, RoughEase);

interface EaseEditorRoughStrengthInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorRoughStrengthInput = (props: EaseEditorRoughStrengthInputProps): ReactElement => {
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const strengthValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough.strength : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'rough' : true);
  const roughTween = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough : null);
  const [strength, setStrength] = useState(strengthValue);
  const dispatch = useDispatch();

  const handleStrengthChange = (e: any): void => {
    const target = e.target;
    setStrength(target.value);
  };

  const handleStrengthSubmit = (e: any): void => {
    try {
      const strengthRounded = Math.round((mexp.eval(`${strength}`) as any + Number.EPSILON) * 100) / 100;
      if (strengthRounded !== strengthValue) {
        let newStrength = strengthRounded;
        if (strengthRounded < 0) {
          newStrength = 0;
        }
        const ref = CustomEase.getSVGData(`rough({clamp: ${roughTween.clamp}, points: ${roughTween.points}, randomize: ${roughTween.randomize}, strength: ${newStrength}, taper: ${roughTween.taper}, template: ${roughTween.template}})`, {width: 400, height: 400});
        dispatch(setLayerRoughTweenStrength({id: id, strength: newStrength, ref: ref}));
        setStrength(newStrength);
      } else {
        setStrength(strengthValue);
      }
    } catch(error) {
      setStrength(strengthValue);
    }
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'Number',
      description: 'Controls how far from the template ease the points are allowed to wander (a small number like 0.1 keeps it very close to the template ease whereas a larger number like 5 creates much bigger variations).'
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
  }

  useEffect(() => {
    setStrength(strengthValue);
  }, [strengthValue]);

  return (
    <SidebarInput
      value={strength}
      disabled={disabled}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChange={handleStrengthChange}
      onSubmit={handleStrengthSubmit}
      submitOnBlur
      manualCanvasFocus
      bottomLabel='Strength' />
  );
}

export default EaseEditorRoughStrengthInput;