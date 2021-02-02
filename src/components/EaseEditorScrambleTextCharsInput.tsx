/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerScrambleTextTweenCharacters } from '../store/actions/layer';
import { DEFAULT_SCRAMBLE_TEXT_TWEEN_CHARACTER_TYPES } from '../constants';
import Form from './Form';
import Icon from './Icon';

interface EaseEditorScrambleTextCharsInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorScrambleTextCharsInput = (props: EaseEditorScrambleTextCharsInputProps): ReactElement => {
  const { setParamInfo } = props;
  const formControlRef = useRef(null);
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const charactersValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].scrambleText.characters : null);
  const [characters, setCharacters] = useState(charactersValue);
  const [prevCharacters, setPrevCharacters] = useState(charactersValue);
  const dispatch = useDispatch();

  const options = DEFAULT_SCRAMBLE_TEXT_TWEEN_CHARACTER_TYPES.map((option) => ({
    value: option,
    label: (() => {
      switch(option) {
        case 'custom':
          return 'Custom';
        case 'lowerCase':
          return 'Lowercase';
        case 'upperAndLowerCase':
          return 'Uppercase and Lowercase';
        case 'upperCase':
          return 'Uppercase';
      }
    })()
  })).map((option, index) => (
    <option
      key={index}
      value={option.value}>
      { option.label }
    </option>
  ));

  useEffect(() => {
    setCharacters(charactersValue);
  }, [charactersValue]);

  useEffect(() => {
    if (characters && characters === 'custom' && (prevCharacters && prevCharacters !== 'custom')) {
      const customInput = document.getElementById('control-ee-sc-custom-characters') as HTMLInputElement;
      customInput.focus();
      customInput.select();
    }
    setPrevCharacters(characters);
  }, [characters]);

  const handleChange = (e: any): void => {
    if (e.target.value !== charactersValue) {
      setCharacters(e.target.value);
      dispatch(setLayerScrambleTextTweenCharacters({id: id, characters: e.target.value}));
    }
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'String | Number',
      description: 'The characters that should be randomly swapped in to the scrambled portion the text.'
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
  }

  return (
    <Form
      inline
      validated={true}>
      <Form.Group controlId='control-ee-sc-characters'>
        <Form.Control
          ref={formControlRef}
          as='select'
          value={characters}
          size='small'
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          required
          rightReadOnly
          right={
            <Form.Text>
              <Icon
                name='list-toggle'
                size='small' />
            </Form.Text>
          }>
          { options }
        </Form.Control>
        <Form.Label>
          Characters
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default EaseEditorScrambleTextCharsInput;