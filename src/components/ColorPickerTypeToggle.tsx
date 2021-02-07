/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { setCanvasColorFormat } from '../store/actions/documentSettings';
import ToggleButton from './ToggleButton';
import Icon from './Icon';
import Form from './Form';

interface ColorPickerTypeToggleProps {
  type: Btwx.ColorFormat;
}

const ColorPickerTypeToggle = (props: ColorPickerTypeToggleProps): ReactElement => {
  const { type } = props;
  const dispatch = useDispatch();

  const handleChange = (): void => {
    switch(type) {
      case 'rgb':
        dispatch(setCanvasColorFormat({colorFormat: 'hsl'}));
        break;
      case 'hsl':
        dispatch(setCanvasColorFormat({colorFormat: 'rgb'}));
        break;
    }
  }

  return (
    <Form>
      <Form.Group controlId='control-cp-rgb-format'>
        <ToggleButton
          name='cp-color-format'
          type='checkbox'
          value={type}
          checked={type === 'rgb'}
          onChange={handleChange}
          size='small'>
          <Icon
            name='list-toggle'
            size='small' />
        </ToggleButton>
      </Form.Group>
    </Form>
  );
}

export default ColorPickerTypeToggle;