import React, { ReactElement, useEffect, useState } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase } from 'gsap/EasePack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerRoughTweenPoints } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

gsap.registerPlugin(CustomEase, RoughEase);

interface EaseEditorRoughPointsInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorRoughPointsInput = (props: EaseEditorRoughPointsInputProps): ReactElement => {
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const pointsValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough.points : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'rough' : true);
  const roughTween = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough : null);
  const [points, setPoints] = useState(pointsValue);
  const dispatch = useDispatch();

  const handlePointsChange = (e: any): void => {
    const target = e.target;
    setPoints(target.value);
  };

  const handlePointsSubmit = (e: any): void => {
    try {
      const pointsRounded = Math.round(points);
      if (pointsRounded !== pointsValue) {
        let newPoints = pointsRounded;
        if (pointsRounded < 0) {
          newPoints = 0;
        }
        const ref = CustomEase.getSVGData(`rough({clamp: ${roughTween.clamp}, points: ${newPoints}, randomize: ${roughTween.randomize}, strength: ${roughTween.strength}, taper: ${roughTween.taper}, template: ${roughTween.template}})`, {width: 400, height: 400});
        dispatch(setLayerRoughTweenPoints({id: id, points: newPoints, ref: ref}));
        setPoints(newPoints);
      } else {
        setPoints(pointsValue);
      }
    } catch(error) {
      setPoints(pointsValue);
    }
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'Number',
      description: 'The number of points to be plotted along the ease, making it jerk more or less frequently.'
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
  }

  useEffect(() => {
    setPoints(pointsValue);
  }, [pointsValue]);

  return (
    <SidebarInput
      value={points}
      disabled={disabled}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handlePointsChange}
      onSubmit={handlePointsSubmit}
      selectOnMount
      manualCanvasFocus
      submitOnBlur
      bottomLabel='Points' />
  );
}

export default EaseEditorRoughPointsInput;