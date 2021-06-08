/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersTextResizeThunk } from '../store/actions/layer';
import { getSelectedTextResize } from '../store/selectors/layer';
import { DEFAULT_TEXT_RESIZE_OPTIONS } from '../constants';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const TextResizeInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const resizeValue = useSelector((state: RootState) => getSelectedTextResize(state));
  const [resize, setResize] = useState(resizeValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setResize(resizeValue);
  }, [resizeValue, selected]);

  const handleChange = (e: any): void => {
    if (e.target.value !== resize) {
      dispatch(setLayersTextResizeThunk({layers: selected, resize: e.target.value as Btwx.TextResize}));
      setResize(e.target.value);
    }
  };

  const options = DEFAULT_TEXT_RESIZE_OPTIONS.map((option) => (
    <ToggleButtonGroup.Button
      key={option}
      value={option}>
      <Icon
        name={`text-resize-${option}`}
        size='small' />
    </ToggleButtonGroup.Button>
  ));

  return (
    <Form inline>
      <Form.Group controlId='control-resize'>
        <ToggleButtonGroup
          type='radio'
          name='resize'
          size='small'
          value={resize}
          onChange={handleChange}>
          { options }
        </ToggleButtonGroup>
        {/* <Form.Label>
          Resize
        </Form.Label> */}
      </Form.Group>
    </Form>
  );
}

export default TextResizeInput;