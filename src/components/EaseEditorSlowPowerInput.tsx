import React, { ReactElement, useEffect, useState } from 'react';
import mexp from 'math-expression-evaluator';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerSlowTweenPower } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

interface EaseEditorSlowPowerInputProps {
  setInputInfo(inputInfo: { type: string; description: string }): void;
}

const EaseEditorSlowPowerInput = (props: EaseEditorSlowPowerInputProps): ReactElement => {
  const { setInputInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const powerValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].slow.power : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'slow' : true);
  const [power, setPower] = useState(powerValue);
  const dispatch = useDispatch();

  const handlePowerChange = (e: any): void => {
    const target = e.target;
    setPower(target.value);
  };

  const handlePowerSubmit = (e: any): void => {
    try {
      const powerRounded = Math.round((mexp.eval(`${power}`) as any + Number.EPSILON) * 100) / 100;
      if (powerRounded !== powerValue) {
        let newPower = powerRounded;
        if (powerRounded < 0) {
          newPower = 0;
        }
        dispatch(setLayerSlowTweenPower({id: id, power: newPower}));
        setPower(newPower);
      } else {
        setPower(powerValue);
      }
    } catch(error) {
      setPower(powerValue);
    }
  }

  const handleFocus = () => {
    setInputInfo({
      type: 'Number',
      description: 'Determines the strength of the ease at each end.'
    });
  }

  const handleBlur = () => {
    setInputInfo(null);
  }

  useEffect(() => {
    setPower(powerValue);
  }, [powerValue]);

  return (
    <SidebarInput
      value={power}
      disabled={disabled}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handlePowerChange}
      onSubmit={handlePowerSubmit}
      submitOnBlur
      bottomLabel='Power' />
  );
}

export default EaseEditorSlowPowerInput;