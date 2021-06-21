/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableScrollFrameTool, disableScrollFrameTool } from '../store/actions/scrollFrameTool';
import { selectedScrollEnabled } from '../store/selectors/layer';
import Form from './Form';
import ToggleButton from './ToggleButton';

const ScrollResizeInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const disabled = useSelector((state: RootState) => state.layer.present.selected.length > 1 || !selectedScrollEnabled(state));
  const scrollResizeValue = useSelector((state: RootState) => state.scrollFrameTool.isEnabled);
  const [scrollResize, setScrollResize] = useState(scrollResizeValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setScrollResize(scrollResizeValue);
  }, [scrollResizeValue]);

  const handleChange = (e: any): void => {
    if (scrollResize) {
      dispatch(disableScrollFrameTool());
    } else {
      dispatch(enableScrollFrameTool({
        id: selected[0]
      }));
    }
    setScrollResize(!scrollResize);
  };

  return (
    <Form inline>
      <Form.Group controlId='control-scroll-resize'>
        <ToggleButton
          type='checkbox'
          name='scrollResize'
          size='small'
          disabled={disabled}
          value={scrollResize}
          checked={scrollResize}
          onChange={handleChange}>
          Resize
        </ToggleButton>
        {/* <Form.Label>
          Scroll Overflow
        </Form.Label> */}
      </Form.Group>
    </Form>
  );
}

export default ScrollResizeInput;