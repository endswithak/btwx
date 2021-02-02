import React, { ReactElement, useContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedFontFamily } from '../store/selectors/layer';
import { openFontFamilySelector, closeFontFamilySelector } from '../store/actions/fontFamilySelector';
import { ThemeContext } from './ThemeProvider';
import Button from './Button';

const FontFamilySelector = (): ReactElement => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const fontFamily = useSelector((state: RootState) => getSelectedFontFamily(state));
  const isOpen = useSelector((state: RootState) => state.fontFamilySelector.isOpen);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (!isOpen) {
      const bounding = buttonRef.current.getBoundingClientRect();
      const scrollTop = document.getElementById('sidebar-scroll-right').scrollTop;
      dispatch(openFontFamilySelector({
        x: bounding.x,
        y: (bounding.y + scrollTop) - (bounding.height - 10),
      }));
    } else {
      dispatch(closeFontFamilySelector());
    }
  }

  return (
    <div
      className='c-sidebar-input'
      id='font-family-input'
      ref={buttonRef}>
      <div className='c-sidebar-input__inner'>
        <Button
          text={fontFamily}
          active={isOpen}
          onClick={handleClick}
          select />
        <div
          className='c-sidebar-input__bottom-label'
          style={{
            color: theme.text.base
          }}>
          Typeface
        </div>
      </div>
    </div>
  );
}

export default FontFamilySelector;