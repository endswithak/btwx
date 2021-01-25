import React, { ReactElement, useEffect, useState } from 'react';
import mexp from 'math-expression-evaluator';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerScrambleTextTweenSpeed } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

interface EaseEditorScrambleTextSpeedInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorScrambleTextSpeedInput = (props: EaseEditorScrambleTextSpeedInputProps): ReactElement => {
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const speedValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].scrambleText.speed : null);
  const [speed, setSpeed] = useState(speedValue);
  const dispatch = useDispatch();

  const handlePowerChange = (e: any): void => {
    const target = e.target;
    if (!isNaN(target.value)) {
      setSpeed(target.value);
    }
  };

  const handlePowerSubmit = (e: any): void => {
    try {
      const evaluatedSpeed = mexp.eval(`${speed}`) as any;
      if (evaluatedSpeed !== speedValue) {
        let newSpeed = evaluatedSpeed;
        if (newSpeed < 0) {
          newSpeed = 0;
        }
        dispatch(setLayerScrambleTextTweenSpeed({id: id, speed: newSpeed}));
        setSpeed(speedValue);
      } else {
        setSpeed(speedValue);
      }
    } catch(error) {
      setSpeed(speedValue);
    }
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'Number',
      description: 'Controls how frequently the scrambled characters are refreshed. The default is 1 but you could slow things down by using 0.2 for example.'
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
  }

  useEffect(() => {
    setSpeed(speedValue);
  }, [speedValue]);

  return (
    <SidebarInput
      value={speed}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handlePowerChange}
      onSubmit={handlePowerSubmit}
      submitOnBlur
      manualCanvasFocus
      bottomLabel='Power' />
  );
}

export default EaseEditorScrambleTextSpeedInput;