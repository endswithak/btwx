import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersCustomWiggleTweenWiggles } from '../store/actions/layer';
import { getSelectedCustomWiggleTweensWiggles } from '../store/selectors/layer';
import MathFormGroup from './MathFormGroup';

interface EaseEditorWiggleWigglesInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorWiggleWigglesInput = (props: EaseEditorWiggleWigglesInputProps): ReactElement => {
  const { setParamInfo } = props;
  const formControlRef = useRef(null);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const wiggles = useSelector((state: RootState) => getSelectedCustomWiggleTweensWiggles(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newWiggles: any): void => {
    if (newWiggles < 0) {
      newWiggles = 0;
    }
    dispatch(setLayersCustomWiggleTweenWiggles({
      tweens: selectedTweens,
      wiggles: newWiggles
    }));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-ee-wiggles-wiggles'
      value={wiggles}
      size='small'
      label='Wiggles'
      min={0}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur />
  );
}

export default EaseEditorWiggleWigglesInput;