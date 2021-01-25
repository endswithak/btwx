import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerScrambleTextTweenCharacters } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

interface EaseEditorScrambleTextCustomCharsInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorScrambleTextCustomCharsInput = (props: EaseEditorScrambleTextCustomCharsInputProps): ReactElement => {
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const customCharsValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].scrambleText.customCharacters : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].scrambleText.characters !== 'custom' : false);
  const [customChars, setCustomChar] = useState(customCharsValue);
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    const target = e.target;
    setCustomChar(target.value);
  };

  const handleSubmit = (e: any): void => {
    if (customChars && customChars !== customCharsValue) {
      dispatch(setLayerScrambleTextTweenCharacters({id: id, characters: 'custom', customCharacters: customChars}));
      setCustomChar(customCharsValue);
    }
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'Number',
      description: 'The characters that should be randomly swapped in to the scrambled portion the text.'
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
  }

  useEffect(() => {
    setCustomChar(customCharsValue);
  }, [customCharsValue]);

  return (
    <SidebarInput
      value={customChars}
      disabled={disabled}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      manualCanvasFocus
      bottomLabel='Custom Characters' />
  );
}

export default EaseEditorScrambleTextCustomCharsInput;