import React, { ReactElement, useEffect, useState } from 'react';
import mexp from 'math-expression-evaluator';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerSlowTweenLinearRatio } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

interface EaseEditorSlowLinearRatioInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorSlowLinearRatioInput = (props: EaseEditorSlowLinearRatioInputProps): ReactElement => {
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const linearRatioValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].slow.linearRatio : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'slow' : true);
  const [linearRatio, setLinearRatio] = useState(linearRatioValue);
  const dispatch = useDispatch();

  const handleLinearRatioChange = (e: any): void => {
    const target = e.target;
    setLinearRatio(target.value);
  };

  const handleLinearRatioSubmit = (e: any): void => {
    try {
      const linearRatioRounded = Math.round((mexp.eval(`${linearRatio}`) as any + Number.EPSILON) * 100) / 100;
      if (linearRatioRounded !== linearRatioValue) {
        let newLinearRatio = linearRatioRounded;
        if (linearRatioRounded > 1) {
          newLinearRatio = 1;
        }
        if (linearRatioRounded < 0) {
          newLinearRatio = 0;
        }
        dispatch(setLayerSlowTweenLinearRatio({id: id, linearRatio: newLinearRatio}));
        setLinearRatio(newLinearRatio);
      } else {
        setLinearRatio(linearRatioValue);
      }
    } catch(error) {
      setLinearRatio(linearRatioValue);
    }
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'Number',
      description: 'Determines the proportion of the ease during which the rate of change will be linear (steady pace). This should be a number between 0 and 1.'
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
  }

  useEffect(() => {
    setLinearRatio(linearRatioValue);
  }, [linearRatioValue]);

  return (
    <SidebarInput
      value={linearRatio}
      disabled={disabled}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleLinearRatioChange}
      onSubmit={handleLinearRatioSubmit}
      selectOnMount
      submitOnBlur
      manualCanvasFocus
      bottomLabel='Ratio' />
  );
}

export default EaseEditorSlowLinearRatioInput;