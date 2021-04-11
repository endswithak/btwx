import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedBlendMode } from '../store/selectors/layer';
import { setLayersBlendMode } from '../store/actions/layer';
import Form from './Form';
import Icon from './Icon';

const BlendModeSelector = (): ReactElement => {
  const formControlRef = useRef<HTMLSelectElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const blendModeValue = useSelector((state: RootState) => getSelectedBlendMode(state));
  const [blendMode, setBlendMode] = useState(blendModeValue);
  const dispatch = useDispatch();

  const options: ReactElement[] = [
    ...(blendModeValue === 'multi' ? [{ value: 'multi', label: 'multi' }] : []),
    { value: 'normal', label: 'Normal' },
    { value: 'darken', label: 'Darken' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'color-burn', label: 'Color Burn' },
    { value: 'lighten', label: 'Lighten' },
    { value: 'screen', label: 'Screen' },
    { value: 'color-dodge', label: 'Color Dodge' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'soft-light', label: 'Soft Light' },
    { value: 'hard-light', label: 'Hard Light' },
    { value: 'difference', label: 'Difference' },
    { value: 'exclusion', label: 'Exclusion' },
    { value: 'hue', label: 'Hue' },
    { value: 'saturation', label: 'Saturation' },
    { value: 'color', label: 'Color' },
    { value: 'luminosity', label: 'Luminosity' }
  ].map((option, index) => (
    <option
      key={index}
      value={option.value}>
      { option.label }
    </option>
  ));

  useEffect(() => {
    setBlendMode(blendModeValue);
  }, [blendModeValue, selected]);

  const handleChange = (e: any): void => {
    if (e.target.value !== 'multi') {
      setBlendMode(e.target.value);
      dispatch(setLayersBlendMode({layers: selected, blendMode: e.target.value}));
    }
  }

  return (
    <Form inline>
      <Form.Group controlId='control-blend-mode'>
        <Form.Control
          ref={formControlRef}
          as='select'
          value={blendMode}
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
          Blend Mode
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default BlendModeSelector;