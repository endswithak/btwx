/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersVerticalAlignmentThunk } from '../store/actions/layer';
import { getSelectedVerticalAlignment } from '../store/selectors/layer';
import { DEFAULT_VERTICAL_ALIGNMENT_OPTIONS } from '../constants';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const VerticalAlignmentInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const verticalAlignmentValue = useSelector((state: RootState) => getSelectedVerticalAlignment(state));
  const disabled = useSelector((state: RootState) => state.layer.present.selected.some((id) => state.layer.present.byId[id] && (state.layer.present.byId[id] as Btwx.Text).textStyle.textResize !== 'fixed'));
  const [verticalAlignment, setVerticalAlignment] = useState(verticalAlignmentValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setVerticalAlignment(verticalAlignmentValue);
  }, [verticalAlignmentValue, selected]);

  const handleChange = (e: any): void => {
    if (e.target.value !== verticalAlignment) {
      dispatch(setLayersVerticalAlignmentThunk({layers: selected, verticalAlignment: e.target.value as Btwx.VerticalAlignment}));
      setVerticalAlignment(e.target.value);
    }
  };

  const options = DEFAULT_VERTICAL_ALIGNMENT_OPTIONS.map((option) => (
    <ToggleButtonGroup.Button
      key={option}
      value={option}
      disabled={disabled}>
      <Icon
        name={`vertical-alignment-${option}`}
        size='small' />
    </ToggleButtonGroup.Button>
  ));

  return (
    <Form inline>
      <Form.Group controlId='control-vertical-alignment'>
        <ToggleButtonGroup
          type='radio'
          name='verticalAlignment'
          size='small'
          value={verticalAlignment}
          onChange={handleChange}>
          { options }
        </ToggleButtonGroup>
        {/* <Form.Label>
          Vertical Alignment
        </Form.Label> */}
      </Form.Group>
    </Form>
  );
}

export default VerticalAlignmentInput;