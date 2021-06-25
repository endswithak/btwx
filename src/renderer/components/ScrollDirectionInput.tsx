/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableGroupsHorizontalScroll, disableGroupsHorizontalScroll, enableGroupsVerticalScroll, disableGroupsVerticalScroll } from '../store/actions/layer';
import { getSelectedHorizontalScroll, getSelectedVerticalScroll, selectedScrollEnabled } from '../store/selectors/layer';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const ScrollDirectionInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const disabled = useSelector((state: RootState) => !selectedScrollEnabled(state));
  const horizontalScrollValue = useSelector((state: RootState) => getSelectedHorizontalScroll(state));
  const verticalScrollValue = useSelector((state: RootState) => getSelectedVerticalScroll(state));
  const [horizontalScroll, setHorizontalScroll] = useState(horizontalScrollValue);
  const [verticalScroll, setVerticalScroll] = useState(verticalScrollValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setHorizontalScroll(horizontalScrollValue);
  }, [horizontalScrollValue, selected]);

  useEffect(() => {
    setVerticalScroll(verticalScrollValue);
  }, [verticalScrollValue, selected]);

  const handleHorizontalScrollChange = (e: any): void => {
    if (horizontalScroll) {
      dispatch(disableGroupsHorizontalScroll({
        layers: selected
      }));
    } else {
      dispatch(enableGroupsHorizontalScroll({
        layers: selected
      }));
    }
    setHorizontalScroll(!horizontalScroll);
  };

  const handleVerticalScrollChange = (e: any): void => {
    if (verticalScroll) {
      dispatch(disableGroupsVerticalScroll({
        layers: selected
      }));
    } else {
      dispatch(enableGroupsVerticalScroll({
        layers: selected
      }));
    }
    setVerticalScroll(!verticalScroll);
  };

  return (
    <Form inline>
      <Form.Group controlId='control-scroll-axis'>
        <ToggleButtonGroup
          type='checkbox'
          disabled={disabled}>
          <ToggleButtonGroup.Button
            type='checkbox'
            name='horizontalScroll'
            size='small'
            value={horizontalScroll === 'multi' ? false : horizontalScroll}
            checked={horizontalScroll === 'multi' ? false : horizontalScroll}
            onChange={handleHorizontalScrollChange}>
            <Icon
              name='x-scroll'
              size='small' />
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button
            type='checkbox'
            name='verticalScroll'
            size='small'
            value={verticalScroll === 'multi' ? false : verticalScroll}
            checked={verticalScroll === 'multi' ? false : verticalScroll}
            onChange={handleVerticalScrollChange}>
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

export default ScrollDirectionInput;