import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersTextTweenDelimiter } from '../store/actions/layer';
import { getSelectedTextTweensDelimiter } from '../store/selectors/layer';
import Form from './Form';

interface EaseEditorTextDelimiterInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorTextDelimiterInput = (props: EaseEditorTextDelimiterInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  // const id = useSelector((state: RootState) => state.easeEditor.tween);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const delimiter = useSelector((state: RootState) => getSelectedTextTweensDelimiter(state));
  const [currentValue, setCurrentValue] = useState(delimiter.length === 0 ? `""` : delimiter === ' ' ? `" "` : delimiter);
  const [valid, setValid] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [evaluation, setEvaluation] = useState(delimiter);
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    const nextValue = e.target.value;
    let nextEval = nextValue;
    if (nextValue === `""` || nextValue === `''`) {
      nextEval = '';
    }
    if (nextValue === `" "` || nextValue === `' '`) {
      nextEval = ' ';
    }
    setCurrentValue(nextValue);
    setEvaluation(nextEval);
    setDirty(nextEval !== delimiter);
  };

  const handleSubmit = (e: any): void => {
    if (valid && dirty && evaluation !== 'multi') {
      dispatch(setLayersTextTweenDelimiter({
        tweens: selectedTweens,
        delimiter: evaluation
      }));
    } else {
      setCurrentValue(delimiter.length === 0 ? `""` : delimiter === ' ' ? `" "` : delimiter);
      setEvaluation(delimiter);
    }
    setDirty(false);
  }

  const handleFocus = (e: any): void => {
    setParamInfo({
      type: 'String | Number',
      description: `The character that should be used to split the text up. The default is "", so each character is isolated but if you'd prefer to animate in word-by-word instead you can use " ".`
    });
  }

  const handleBlur = (e: any): void => {
    setParamInfo(null);
  }

  useEffect(() => {
    setCurrentValue(delimiter.length === 0 ? `""` : delimiter === ' ' ? `" "` : delimiter);
    setEvaluation(delimiter);
  }, [delimiter]);

  useEffect(() => {
    if (formControlRef.current) {
      formControlRef.current.focus();
      formControlRef.current.select();
    }
  }, []);

  return (
    <Form
      inline
      onSubmit={handleSubmit}
      submitOnBlur>
      <Form.Group controlId='control-ee-text-delimiter'>
        <Form.Control
          onBlur={handleBlur}
          onFocus={handleFocus}
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
          Delimiter
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default EaseEditorTextDelimiterInput;