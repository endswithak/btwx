import React, { ReactElement, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase } from 'gsap/EasePack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersRoughTweenPoints } from '../store/actions/layer';
import { getSelectedRoughTweensPoints, getSelectedRoughTweenPropsMatch } from '../store/selectors/layer';
import MathFormGroup from './MathFormGroup';

gsap.registerPlugin(CustomEase, RoughEase);

interface EaseEditorRoughPointsInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorRoughPointsInput = (props: EaseEditorRoughPointsInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const points = useSelector((state: RootState) => getSelectedRoughTweensPoints(state));
  const roughPropsMatch = useSelector((state: RootState) => getSelectedRoughTweenPropsMatch(state));
  const selectedTweensById = useSelector((state: RootState) => selectedTweens.reduce((result, current) => ({
    ...result,
    [current]: state.layer.present.tweens.byId[current]
  }), {}));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newPoints: any): void => {
    if (newPoints < 0) {
      newPoints = 0;
    }
    if (roughPropsMatch) {
      const tweenRef = selectedTweensById[selectedTweens[0]];
      const sharedRef = CustomEase.getSVGData(`rough({
        clamp: ${tweenRef.rough.clamp},
        points: ${newPoints},
        randomize: ${tweenRef.rough.randomize},
        strength: ${tweenRef.rough.strength},
        taper: ${tweenRef.rough.taper},
        template: ${tweenRef.rough.template}
      })`, {
        width: 400,
        height: 400
      });
      dispatch(setLayersRoughTweenPoints({
        tweens: selectedTweens,
        points: newPoints,
        ref: selectedTweens.reduce((result, current) => ({
          ...result,
          [current]: sharedRef
        }), {})
      }));
    } else {
      dispatch(setLayersRoughTweenPoints({
        tweens: selectedTweens,
        points: newPoints,
        ref: selectedTweens.reduce((result, current) => {
          const tweenItem = selectedTweensById[current];
          const roughProps = tweenItem.rough;
          return {
            ...result,
            [current]: CustomEase.getSVGData(`rough({
              clamp: ${roughProps.clamp},
              points: ${newPoints},
              randomize: ${roughProps.randomize},
              strength: ${roughProps.strength},
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

export default EaseEditorRoughPointsInput;