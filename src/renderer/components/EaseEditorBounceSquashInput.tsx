import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersCustomBounceTweenSquash } from '../store/actions/layer';
import { getSelectedCustomBounceTweensSquash } from '../store/selectors/layer';
import MathFormGroup from './MathFormGroup';

interface EaseEditorBounceSquashInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorBounceSquashInput = (props: EaseEditorBounceSquashInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  // const id = useSelector((state: RootState) => state.easeEditor.tween);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const squash = useSelector((state: RootState) => getSelectedCustomBounceTweensSquash(state));
  // const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'customBounce' : true);
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newSquash: any): void => {
    if (newSquash < 0) {
      newSquash = 0;
    }
    dispatch(setLayersCustomBounceTweenSquash({
      tweens: selectedTweens,
      squash: newSquash
    }));
  }

  const handleFocus = (e: any): void => {
    setParamInfo({
      type: 'Number',
      description: 'Controls how long the squash should last (the gap between bounces, when it appears “stuck”).'
    });
  }

  const handleBlur = (e: any): void => {
    setParamInfo(null);
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-ee-bounce-squash'
      value={squash}
      // disabled={disabled}
      size='small'
      label='Squash'
      min={0}
      onSubmitSuccess={handleSubmitSuccess}
      onBlur={handleBlur}
      onFocus={handleFocus}
      submitOnBlur />
  );
}

export default EaseEditorBounceSquashInput;