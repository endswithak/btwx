/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerScrambleTextTweenCharacters } from '../store/actions/layer';
import { DEFAULT_SCRAMBLE_TEXT_TWEEN_CHARACTER_TYPES } from '../constants';
import SidebarSelect from './SidebarSelect';

interface EaseEditorScrambleTextCharsInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorScrambleTextCharsInput = (props: EaseEditorScrambleTextCharsInputProps): ReactElement => {
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const charactersValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].scrambleText.characters : null);
  const dispatch = useDispatch();

  const characterOptions = DEFAULT_SCRAMBLE_TEXT_TWEEN_CHARACTER_TYPES.map((option) => ({
    value: option,
    label: option
  }));

  const [characters, setCharacters] = useState(charactersValue ? characterOptions.find((option) => option.value === charactersValue) : null);

  useEffect(() => {
    setCharacters(charactersValue ? characterOptions.find((option) => option.value === charactersValue) : null);
  }, [charactersValue]);

  const handleSelectorChange = (selectedOption: { value: Btwx.ScrambleTextTweenCharacters; label: Btwx.ScrambleTextTweenCharacters }): void => {
    if (selectedOption.value !== charactersValue) {
      setCharacters(selectedOption);
      dispatch(setLayerScrambleTextTweenCharacters({id: id, characters: selectedOption.value}));
    }
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'String',
      description: 'The characters that should be randomly swapped in to the scrambled portion the text.'
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
  }

  return (
    <SidebarSelect
      value={characters}
      onChange={handleSelectorChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      options={characterOptions}
      placeholder='multi'
      bottomLabel='Characters' />
  );
}

export default EaseEditorScrambleTextCharsInput;