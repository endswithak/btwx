import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { DEFAULT_TEXT_TRANSFORM_OPTIONS } from '../constants';
import { setLayersTextTransformThunk } from '../store/actions/layer';
import { getSelectedTextTransform } from '../store/selectors/layer';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const TextTransformInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const textTransformValue = useSelector((state: RootState) => getSelectedTextTransform(state));
  const [textTransform, setTextTransform] = useState(textTransformValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setTextTransform(textTransformValue);
  }, [textTransformValue, selected]);

  const handleChange = (e: any): void => {
    dispatch(setLayersTextTransformThunk({layers: selected, textTransform: e.target.value as Btwx.TextTransform}));
    setTextTransform(e.target.value);
  };

  const options = DEFAULT_TEXT_TRANSFORM_OPTIONS.map((option) => (
    <ToggleButtonGroup.Button
      key={option}
      value={option}>
      <Icon
        name={`text-transform-${option}`}
        size='small' />
    </ToggleButtonGroup.Button>
  ));

  return (
    <Form inline>
      <Form.Group controlId='control-text-transform'>
        <ToggleButtonGroup
          type='radio'
          name='text-transform'
          size='small'
          value={textTransform}
          onChange={handleChange}>
          { options }
        </ToggleButtonGroup>
        <Form.Label>
          Transform
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default TextTransformInput;