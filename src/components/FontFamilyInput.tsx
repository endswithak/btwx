import React, { ReactElement, useContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { getSelectedFontFamily } from '../store/selectors/layer';
import { openFontFamilySelector, closeFontFamilySelector } from '../store/actions/fontFamilySelector';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface ButtonProps {
  isActive: boolean;
  disabled?: boolean;
}

const Button = styled.button<ButtonProps>`
  background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  color: ${props => props.theme.text.base};
  box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
  svg {
    right: -3px;
    position: relative;
    fill: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.lighter};
    :hover {
      fill: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.light};
    }
  }
  :hover {
    box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
  }
`;

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
          className='c-sidebar-input__field c-sidebar-input__field--dropdown-selector'
          theme={theme}
          isActive={isOpen}
          onClick={handleClick}>
          <span>{ fontFamily }</span>
          <Icon
            name='thicc-chevron-down'
            small />
        </Button>
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