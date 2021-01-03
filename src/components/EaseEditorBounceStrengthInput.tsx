import React, { ReactElement, useEffect, useState } from 'react';
import mexp from 'math-expression-evaluator';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerCustomBounceTweenStrength } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const EaseEditorBounceStrengthInput = (): ReactElement => {
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const strengthValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].customBounce.strength : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'customBounce' : true);
  const [strength, setStrength] = useState(strengthValue);
  const dispatch = useDispatch();

  const handleStrengthChange = (e: any): void => {
    const target = e.target;
    setStrength(target.value);
  };

  const handleStrengthSubmit = (e: any): void => {
    try {
      const strengthRounded = Math.round((mexp.eval(`${strength}`) as any + Number.EPSILON) * 100) / 100
      if (strengthRounded !== strengthValue) {
        let newStrength = strengthRounded;
        if (newStrength > 1) {
          newStrength = 1;
        }
        if (strengthRounded < 0) {
          newStrength = 0;
        }
        dispatch(setLayerCustomBounceTweenStrength({id: id, strength: newStrength}));
        setStrength(newStrength);
      } else {
        setStrength(strengthValue);
      }
    } catch(error) {
      setStrength(strengthValue);
    }
  }

  useEffect(() => {
    setStrength(strengthValue);
  }, [strengthValue]);

  return (
    <SidebarInput
      value={strength}
      disabled={disabled}
      onChange={handleStrengthChange}
      onSubmit={handleStrengthSubmit}
      submitOnBlur
      bottomLabel='Strength' />
  );
}

export default EaseEditorBounceStrengthInput;