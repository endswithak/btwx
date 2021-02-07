import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedStrokeEnabled, getSelectedStrokeJoin } from '../store/selectors/layer';
import { setLayersStrokeJoin } from '../store/actions/layer';
import { DEFAULT_STROKE_JOIN_OPTIONS } from '../constants';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const StrokeJoinInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const strokeJoinValue = useSelector((state: RootState) => getSelectedStrokeJoin(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state) || (state.layer.present.selected.every((id) => state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Line')));
  const [strokeJoin, setStrokeJoin] = useState<Btwx.StrokeJoin | 'multi'>(strokeJoinValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setStrokeJoin(strokeJoinValue);
  }, [strokeJoinValue, disabled, selected]);

  const handleChange = (e: any): void => {
    dispatch(setLayersStrokeJoin({layers: selected, strokeJoin: e.target.value}));
    setStrokeJoin(e.target.value);
  };

  const options = DEFAULT_STROKE_JOIN_OPTIONS.map((option) => (
    <ToggleButtonGroup.Button
      key={option}
      value={option}
      disabled={disabled}>
      <Icon
        name={`stroke-join-${option}`}
        size='small' />
    </ToggleButtonGroup.Button>
  ));

  return (
    <Form inline>
      <Form.Group controlId='control-stroke-join'>
        <ToggleButtonGroup
          type='radio'
          name='stroke-join'
          size='small'
          value={strokeJoin}
          onChange={handleChange}>
          { options }
        </ToggleButtonGroup>
        <Form.Label>
          Join
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default StrokeJoinInput;