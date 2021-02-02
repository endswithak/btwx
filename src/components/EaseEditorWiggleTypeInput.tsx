import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize';
import { RootState } from '../store/reducers';
import { setLayerCustomWiggleTweenType } from '../store/actions/layer';
import { DEFAULT_CUSTOM_WIGGLE_TWEEN_TYPES } from '../constants';
import Form from './Form';
import Icon from './Icon';

const EaseEditorWiggleTypeInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const typeValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].customWiggle.type : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'customWiggle' : true);
  const [type, setType] = useState(typeValue);
  const dispatch = useDispatch();

  const options = DEFAULT_CUSTOM_WIGGLE_TWEEN_TYPES.map((option) => {
    switch(option) {
      case 'easeInOut':
        return { value: option, label: 'In Out' };
      case 'easeOut':
        return { value: option, label: 'Out' };
      default:
        return { value: option, label: capitalize(option) }
    }
  }).map((option, index) => (
    <option
      key={index}
      value={option.value}>
      { option.label }
    </option>
  ));

  const handleChange = (e: any): void => {
    if (e.target.value !== typeValue) {
      setType(e.target.value);
      dispatch(setLayerCustomWiggleTweenType({id: id, type: e.target.value}));
    }
  }

  useEffect(() => {
    setType(typeValue);
  }, [typeValue]);

  return (
    <Form inline>
      <Form.Group controlId='control-ee-wiggle-type'>
        <Form.Control
          ref={formControlRef}
          as='select'
          value={type}
          disabled={disabled}
          size='small'
          onChange={handleChange}
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
          Type
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default EaseEditorWiggleTypeInput;