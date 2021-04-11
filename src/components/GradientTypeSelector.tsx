import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersGradientType } from '../store/actions/layer';
import Form from './Form';
import Icon from './Icon';

interface GradientTypeSelectorProps {
  prop: 'fill' | 'stroke';
  gradientTypeValue: Btwx.GradientType | 'multi';
  disabled?: boolean;
}

const GradientTypeSelector = (props: GradientTypeSelectorProps): ReactElement => {
  const { prop, disabled, gradientTypeValue } = props;
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const [gradientType, setGradientType] = useState(gradientTypeValue);
  const dispatch = useDispatch();

  const options = [
    ...(gradientTypeValue === 'multi' ? [{ value: 'multi', label: 'multi' }] : []),
    { value: 'linear', label: 'Linear' },
    { value: 'radial', label: 'Radial' }
  ].map((option, index) => (
    <option
      key={index}
      value={option.value}>
      { option.label }
    </option>
  ));

  useEffect(() => {
    setGradientType(gradientTypeValue);
  }, [gradientTypeValue, selected]);

  const handleChange = (e: any): void => {
    if (e.target.value !== 'multi') {
      setGradientType(e.target.value);
      dispatch(setLayersGradientType({layers: selected, prop: prop, gradientType: e.target.value}));
    }
  }

  return (
    <Form inline>
      <Form.Group controlId={`control-${prop}-gradient-type`}>
        <Form.Control
          ref={formControlRef}
          as='select'
          value={gradientType}
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

export default GradientTypeSelector;