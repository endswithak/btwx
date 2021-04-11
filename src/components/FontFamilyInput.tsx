import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedFontFamily } from '../store/selectors/layer';
import { openFontFamilySelector, closeFontFamilySelector } from '../store/actions/fontFamilySelector';
import Form from './Form';
import Icon from './Icon';

const FontFamilyInput = (): ReactElement => {
  const controlRef = useRef(null);
  const fontFamily = useSelector((state: RootState) => getSelectedFontFamily(state));
  const isOpen = useSelector((state: RootState) => state.fontFamilySelector.isOpen);
  const dispatch = useDispatch();

  const handleClick = (e: any): void => {
    if (!isOpen) {
      const sidebarRightScroll = document.getElementById('sidebar-scroll-right');
      const controlBox = controlRef.current.getBoundingClientRect();
      const sidebarBox = sidebarRightScroll.getBoundingClientRect();
      const scrollTop = sidebarRightScroll.scrollTop;
      dispatch(openFontFamilySelector({
        x: controlBox.x,
        y: (controlBox.y + scrollTop + controlBox.height + 8) - sidebarBox.top
      }));
    } else {
      dispatch(closeFontFamilySelector());
    }
  }

  return (
    <Form inline>
      <Form.Group controlId='control-font-family'>
        <Form.Control
          ref={controlRef}
          as='input'
          value={fontFamily}
          size='small'
          onChange={() => {return;}}
          onMouseDown={handleClick}
          isActive={isOpen}
          required
          readOnly
          rightReadOnly
          right={
            <Form.Text>
              <Icon
                name='list-toggle'
                size='small' />
            </Form.Text>
          } />
        <Form.Label>
          Typeface
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default FontFamilyInput;