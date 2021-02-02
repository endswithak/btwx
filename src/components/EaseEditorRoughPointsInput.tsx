import React, { ReactElement, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase } from 'gsap/EasePack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerRoughTweenPoints } from '../store/actions/layer';
import MathFormGroup from './MathFormGroup';

gsap.registerPlugin(CustomEase, RoughEase);

interface EaseEditorRoughPointsInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorRoughPointsInput = (props: EaseEditorRoughPointsInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const points = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough.points : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'rough' : true);
  const roughTween = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough : null);
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newPoints: any): void => {
    if (newPoints < 0) {
      newPoints = 0;
    }
    const ref = CustomEase.getSVGData(`rough({clamp: ${roughTween.clamp}, points: ${newPoints}, randomize: ${roughTween.randomize}, strength: ${roughTween.strength}, taper: ${roughTween.taper}, template: ${roughTween.template}})`, {width: 400, height: 400});
    dispatch(setLayerRoughTweenPoints({id: id, points: newPoints, ref: ref}));
  }

  const handleFocus = (e: any): void => {
    setParamInfo({
      type: 'Number',
      description: 'The number of points to be plotted along the ease, making it jerk more or less frequently.'
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
      controlId='control-ee-rough-points'
      value={points}
      disabled={disabled}
      size='small'
      label='Points'
      min={0}
      onSubmitSuccess={handleSubmitSuccess}
      onBlur={handleBlur}
      onFocus={handleFocus}
      submitOnBlur />
  );
}

export default EaseEditorRoughPointsInput;