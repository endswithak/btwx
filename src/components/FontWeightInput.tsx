/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersFontWeightThunk } from '../store/actions/layer';
import { getSelectedFontWeight } from '../store/selectors/layer';
import Form from './Form';
import Icon from './Icon';

const FontWeightInput = (): ReactElement => {
  const formRef = useRef<HTMLFormElement>(null);
  const formControlRef = useRef<HTMLSelectElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const fontWeightValue = useSelector((state: RootState) => getSelectedFontWeight(state));
  const [fontWeight, setFontWeight] = useState(fontWeightValue);
  const dispatch = useDispatch();

  const options = [
    ...(fontWeightValue === 'multi' ? [{ value: 'multi', label: 'multi' }] : []),
    { value: 100, label: 100 },
    { value: 200, label: 200 },
    { value: 300, label: 300 },
    { value: 400, label: 400 },
    { value: 500, label: 500 },
    { value: 600, label: 600 },
    { value: 700, label: 700 },
    { value: 800, label: 800 },
    { value: 900, label: 900 }
  ].map((option, index) => (
    <option
      key={index}
      value={option.value}>
      { option.label }
    </option>
  ));

  useEffect(() => {
    setFontWeight(fontWeightValue);
  }, [fontWeightValue]);

  const handleChange = (e: any): void => {
    setFontWeight(e.target.value);
    dispatch(setLayersFontWeightThunk({layers: selected, fontWeight: e.target.value}));
  }

  return (
    <Form
      ref={formRef}
      inline
      validated={true}>
      <Form.Group controlId='control-font-weight'>
        <Form.Control
          ref={formControlRef}
          as='select'
          value={fontWeight}
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
          Weight
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default FontWeightInput;