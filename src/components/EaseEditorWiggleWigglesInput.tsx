import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerCustomWiggleTweenWiggles } from '../store/actions/layer';
import MathFormGroup from './MathFormGroup';

const EaseEditorWiggleWigglesInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const wiggles = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].customWiggle.wiggles : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'customWiggle' : true);
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newWiggles: any): void => {
    if (newWiggles < 0) {
      newWiggles = 0;
    }
    dispatch(setLayerCustomWiggleTweenWiggles({id: id, wiggles: newWiggles}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-ee-wiggles-wiggles'
      value={wiggles}
      disabled={disabled}
      size='small'
      label='Wiggles'
      min={0}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur />
  );
}

export default EaseEditorWiggleWigglesInput;