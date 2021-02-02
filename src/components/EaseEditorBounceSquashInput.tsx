import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerCustomBounceTweenSquash } from '../store/actions/layer';
import MathFormGroup from './MathFormGroup';

interface EaseEditorBounceSquashInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorBounceSquashInput = (props: EaseEditorBounceSquashInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const squash = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].customBounce.squash : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'customBounce' : true);
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newSquash: any): void => {
    if (newSquash < 0) {
      newSquash = 0;
    }
    dispatch(setLayerCustomBounceTweenSquash({id: id, squash: newSquash}));
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
      disabled={disabled}
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