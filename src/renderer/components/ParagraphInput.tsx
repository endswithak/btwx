import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersParagraphThunk } from '../store/actions/layer';
import { getSelectedParagraph } from '../store/selectors/layer';
// import { setTextSettingsLeading } from '../store/actions/textSettings';
import MathFormGroup from './MathFormGroup';

const ParagraphInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const paragraph = useSelector((state: RootState) => getSelectedParagraph(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newParagraph: any): void => {
    dispatch(setLayersParagraphThunk({layers: selected, paragraph: newParagraph}));
    // dispatch(setTextSettingsLeading({leading: newLeading}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-paragraph'
      value={paragraph}
      size='small'
      label='Paragraph'
      min={0}
      onSubmitSuccess={handleSubmitSuccess}
      canvasAutoFocus
      submitOnBlur />
  );
}

export default ParagraphInput;