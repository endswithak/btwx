/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { setGroupsScrollOverflow } from '../store/actions/layer';
import { getSelectedScrollOverflow, selectedScrollEnabled } from '../store/selectors/layer';
import { DEFAULT_SCROLL_OVERFLOW_OPTIONS } from '../constants';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const ScrollOverflowInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const disabled = useSelector((state: RootState) => !selectedScrollEnabled(state));
  const scrollOverflowValue = useSelector((state: RootState) => getSelectedScrollOverflow(state));
  const [scrollOverflow, setScrollOverflow] = useState(scrollOverflowValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setScrollOverflow(scrollOverflowValue);
  }, [scrollOverflowValue, selected]);

  const handleChange = (e: any): void => {
    if (e.target.value !== scrollOverflow) {
      dispatch(setGroupsScrollOverflow({
        layers: selected,
        overflow: e.target.value as Btwx.ScrollOverflow
      }));
      setScrollOverflow(e.target.value);
    }
  };

  const options = DEFAULT_SCROLL_OVERFLOW_OPTIONS.map((option) => (
    <ToggleButtonGroup.Button
      key={option}
      value={option}>
      <Icon
        name={option}
        size='small' />
    </ToggleButtonGroup.Button>
  ));

  return (
    <Form inline>
      <Form.Group controlId='control-scroll-overflow'>
        <ToggleButtonGroup
          type='radio'
          name='scrollOverflow'
          size='small'
          value={scrollOverflow}
          disabled={disabled}
          onChange={handleChange}>
          { options }
        </ToggleButtonGroup>
        {/* <Form.Label>
          Scroll Overflow
        </Form.Label> */}
      </Form.Group>
    </Form>
  );
}

export default ScrollOverflowInput;