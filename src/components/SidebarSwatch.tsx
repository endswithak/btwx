import React, { useContext, ReactElement, useRef } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarSwatchProps {
  style?: any;
  onClick?(bounding: DOMRect): void;
  bottomLabel?: string;
  disabled?: boolean;
  isActive?: boolean;
  multi?: boolean;
}

const Swatch = styled.div<SidebarSwatchProps>`
  .c-sidebar-swatch {
    box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
    svg {
      fill: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.lighter};
    }
    :disabled {
      opacity: 0.5;
    }
    :hover {
      box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
      svg {
        fill: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.base};
      }
    }
  }
  .c-sidebar-input__bottom-label {
    color: ${props => props.theme.text.base};
  }
`;

const SidebarSwatch = (props: SidebarSwatchProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const swatchRef = useRef<HTMLDivElement>(null);
  const { style, isActive, bottomLabel, disabled, onClick, multi } = props;
  const handleClick = () => {
    const bounding = swatchRef.current.getBoundingClientRect();
    const scrollTop = document.getElementById('sidebar-scroll-right').scrollTop;
    onClick({
      x: bounding.x,
      y: bounding.y + scrollTop,
      width: bounding.width,
      height: bounding.height,
      top: bounding.top + scrollTop,
      right: bounding.right,
      bottom: bounding.bottom - scrollTop,
      left: bounding.left
    } as DOMRect);
  }
  return (
    <Swatch
      className='c-sidebar-input'
      ref={swatchRef}
      isActive={isActive}
      theme={theme}>
      <div className='c-sidebar-input__inner'>
        <button
          className='c-sidebar-swatch'
          onClick={handleClick}
          disabled={disabled}
          style={style}>
          {
            multi
            ? <Icon name='more' />
            : null
          }
        </button>
        {
          bottomLabel
          ? <div
              className='c-sidebar-input__bottom-label'
              style={{
                color: theme.text.base
              }}>
              { bottomLabel }
            </div>
          : null
        }
      </div>
    </Swatch>
  );
}

export default SidebarSwatch;