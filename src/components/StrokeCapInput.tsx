import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedStrokeEnabled, getSelectedStrokeCap } from '../store/selectors/layer';
import { setLayersStrokeCap } from '../store/actions/layer';
import { DEFAULT_STROKE_CAP_OPTIONS } from '../constants';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const StrokeCapInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const strokeCapValue = useSelector((state: RootState) => getSelectedStrokeCap(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state));
  const [strokeCap, setStrokeCap] = useState<Btwx.StrokeCap | 'multi'>(strokeCapValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setStrokeCap(strokeCapValue);
  }, [strokeCapValue, disabled, selected]);

  const handleChange = (e: any): void => {
    dispatch(setLayersStrokeCap({layers: selected, strokeCap: e.target.value}));
    setStrokeCap(e.target.value);
  };

  const options = DEFAULT_STROKE_CAP_OPTIONS.map((option) => (
    <ToggleButtonGroup.Button
      key={option}
      value={option}
      disabled={disabled}>
      <Icon
        name={`stroke-cap-${option}`}
        size='small' />
    </ToggleButtonGroup.Button>
  ));

  return (
    <Form inline>
      <Form.Group controlId='control-stroke-cap'>
        <ToggleButtonGroup
          type='radio'
          name='stroke-cap'
          size='small'
          value={strokeCap}
          onChange={handleChange}>
          { options }
        </ToggleButtonGroup>
        <Form.Label>
          Cap
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default StrokeCapInput;