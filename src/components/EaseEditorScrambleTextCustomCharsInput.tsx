import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersScrambleTextTweenCharacters } from '../store/actions/layer';
import { getSelectedScrambleTextTweensCustomCharacters, getSelectedScrambleTextTweensCharacters } from '../store/selectors/layer';
import Form from './Form';

interface EaseEditorScrambleTextCustomCharsInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorScrambleTextCustomCharsInput = (props: EaseEditorScrambleTextCustomCharsInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  // const id = useSelector((state: RootState) => state.easeEditor.tween);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const customCharsValue = useSelector((state: RootState) => getSelectedScrambleTextTweensCustomCharacters(state));
  const charactersValue = useSelector((state: RootState) => getSelectedScrambleTextTweensCharacters(state));
  const [currentValue, setCurrentValue] = useState(customCharsValue);
  const [valid, setValid] = useState(true);
  const [dirty, setDirty] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    const value = e.target.value;
    setCurrentValue(value);
    setDirty(value !== customCharsValue);
    setValid(value.length > 0);
  };

  const handleSubmit = (e: any): void => {
    if (valid && dirty) {
      dispatch(setLayersScrambleTextTweenCharacters({
        tweens: selectedTweens,
        characters: 'custom',
        customCharacters: currentValue
      }));
    } else {
      setCurrentValue(customCharsValue);
      setValid(true);
    }
    setDirty(false);
  }

  const handleFocus = (e: any): void => {
    setParamInfo({
      type: 'String | Number',
      description: 'The characters that should be randomly swapped in to the scrambled portion the text.'
    });
  }

  const handleBlur = (e: any): void => {
    setParamInfo(null);
  }

  useEffect(() => {
    setCurrentValue(customCharsValue);
    setValid(true);
  }, [customCharsValue]);

  return (
    <Form
      inline
      onSubmit={handleSubmit}
      submitOnBlur>
      <Form.Group controlId='control-ee-sc-custom-characters'>
        <Form.Control
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={charactersValue !== 'custom'}
          ref={formControlRef}
          as='input'
          value={currentValue}
          size='small'
          type='text'
          isValid={valid && dirty}
          onChange={handleChange}
          required
          rightReadOnly
          leftReadOnly />
        <Form.Label>
          Characters
        </Form.Label>
      </Form.Group>
    </Form>
    // <TextInput
    //   ref={textInputRef}
    //   field={{
    //     value: customChars,
    //     id: 'scramble-custom-characters-input',
    //     disabled: disabled,
    //     onFocus: (e: any): void => handleFocus(e),
    //     onBlur: (e: any): void => handleBlur(e),
    //     onChange: (e: any): void => handleChange(e),
    //     onSubmit: (e: any): void => handleSubmit(e)
    //   }}
    //   label='Characters'
    //   submitOnBlur
    //   manualCanvasFocus />
  );
}

export default EaseEditorScrambleTextCustomCharsInput;