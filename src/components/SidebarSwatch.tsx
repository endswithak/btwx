import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

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
      box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
      svg {
        fill: ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.text.base};
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
            ? <svg
                viewBox='0 0 24 24'
                width='24px'
                height='24px'>
                <path d='M5,10 C6.1045695,10 7,10.8954305 7,12 C7,13.1045695 6.1045695,14 5,14 C3.8954305,14 3,13.1045695 3,12 C3,10.8954305 3.8954305,10 5,10 Z M12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 C10.8954305,14 10,13.1045695 10,12 C10,10.8954305 10.8954305,10 12,10 Z M19,10 C20.1045695,10 21,10.8954305 21,12 C21,13.1045695 20.1045695,14 19,14 C17.8954305,14 17,13.1045695 17,12 C17,10.8954305 17.8954305,10 19,10 Z' />
              </svg>
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