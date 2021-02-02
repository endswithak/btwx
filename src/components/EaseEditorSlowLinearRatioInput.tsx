import React, { ReactElement, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerSlowTweenLinearRatio } from '../store/actions/layer';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

interface EaseEditorSlowLinearRatioInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorSlowLinearRatioInput = (props: EaseEditorSlowLinearRatioInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const linearRatio = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].slow.linearRatio : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'slow' : true);
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newLinearRatio: any): void => {
    if (newLinearRatio > 1) {
      newLinearRatio = 1;
    }
    if (newLinearRatio < 0) {
      newLinearRatio = 0;
    }
    dispatch(setLayerSlowTweenLinearRatio({id: id, linearRatio: newLinearRatio}));
  }

  const handleFocus = (e: any): void => {
    setParamInfo({
      type: 'Number',
      description: 'Determines the proportion of the ease during which the rate of change will be linear (steady pace). This should be a number between 0 and 1.'
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
      controlId='control-ee-slow-ratio'
      value={linearRatio}
      disabled={disabled}
      size='small'
      label='Ratio'
      min={0}
      max={1}
      onSubmitSuccess={handleSubmitSuccess}
      onBlur={handleBlur}
      onFocus={handleFocus}
      submitOnBlur />
  );
}

export default EaseEditorSlowLinearRatioInput;