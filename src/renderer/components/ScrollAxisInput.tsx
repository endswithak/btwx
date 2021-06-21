/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableGroupsScrollXAxis, disableGroupsScrollXAxis, enableGroupsScrollYAxis, disableGroupsScrollYAxis } from '../store/actions/layer';
import { getSelectedScrollXAxis, getSelectedScrollYAxis, selectedScrollEnabled } from '../store/selectors/layer';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const ScrollAxisInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const disabled = useSelector((state: RootState) => !selectedScrollEnabled(state));
  const scrollXAxisValue = useSelector((state: RootState) => getSelectedScrollXAxis(state));
  const scrollYAxisValue = useSelector((state: RootState) => getSelectedScrollYAxis(state));
  const [scrollXAxis, setScrollXAxis] = useState(scrollXAxisValue);
  const [scrollYAxis, setScrollYAxis] = useState(scrollYAxisValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setScrollXAxis(scrollXAxisValue);
  }, [scrollXAxisValue, selected]);

  useEffect(() => {
    setScrollYAxis(scrollYAxisValue);
  }, [scrollYAxisValue, selected]);

  const handleXAxisChange = (e: any): void => {
    if (scrollXAxis) {
      dispatch(disableGroupsScrollXAxis({
        layers: selected
      }));
    } else {
      dispatch(enableGroupsScrollXAxis({
        layers: selected
      }));
    }
    setScrollXAxis(!scrollXAxis);
  };

  const handleYAxisChange = (e: any): void => {
    if (scrollYAxis) {
      dispatch(disableGroupsScrollYAxis({
        layers: selected
      }));
    } else {
      dispatch(enableGroupsScrollYAxis({
        layers: selected
      }));
    }
    setScrollYAxis(!scrollXAxis);
  };

  return (
    <Form inline>
      <Form.Group controlId='control-scroll-axis'>
        <ToggleButtonGroup
          type='checkbox'>
          <ToggleButtonGroup.Button
            type='checkbox'
            name='scrollXAxis'
            size='small'
            value={scrollXAxis === 'multi' ? false : scrollXAxis}
            checked={scrollXAxis === 'multi' ? false : scrollXAxis}
            disabled={disabled}
            onChange={handleXAxisChange}>
            <Icon
              name='x-scroll'
              size='small' />
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button
            type='checkbox'
            name='scrollYAxis'
            size='small'
            value={scrollYAxis === 'multi' ? false : scrollYAxis}
            checked={scrollYAxis === 'multi' ? false : scrollYAxis}
            disabled={disabled}
            onChange={handleYAxisChange}>
            <Icon
              name='y-scroll'
              size='small' />
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup>
        {/* <Form.Label>
          Scroll Overflow
        </Form.Label> */}
      </Form.Group>
    </Form>
  );
}

export default ScrollAxisInput;