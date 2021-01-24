/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize';
import { RootState } from '../store/reducers';
import { setLayerTweenEase } from '../store/actions/layer';
import { DEFAULT_TWEEN_EASE_OPTIONS } from '../constants';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

export interface TopbarDropdownButtonOptionProps {
  onClick(event: React.SyntheticEvent): void;
  isActive?: boolean;
  disabled?: boolean;
  icon?: string;
  label: string;
}

const Button = styled.button<TopbarDropdownButtonOptionProps>`
  background: ${props => props.isActive ? props.theme.palette.primary : 'none'};
  .c-ease-editor-selector-item__icon {
    svg {
      stroke: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.lighter};
    }
  }
  .c-ease-editor-selector-item__label {
    color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
  }
  :after {
    background: ${props => props.theme.text.lightest};
  }
  :hover {
    background: ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.palette.primary};
    .c-ease-editor-selector-item__icon {
      svg {
        stroke: ${props => props.theme.text.onPrimary};
      }
    }
    .c-ease-editor-selector-item__label {
      color: ${props => props.theme.text.onPrimary};
    }
  }
`;

export interface EaseEditorSelectorItemProps {
  value: string;
  label: string;
  icon?: string;
  onClick(): any;
}

const EaseEditorSelectorItem = (props: EaseEditorSelectorItemProps & { isActive: boolean; setIsOpen(isOpen: boolean): void }): ReactElement => {
  const theme = useContext(ThemeContext);
  const { label, icon, isActive, onClick, setIsOpen } = props;

  const handleClick = () => {
    onClick();
    setIsOpen(false);
  }

  return (
    <Button
      className='c-ease-editor-selector__item'
      {...props}
      onClick={handleClick}
      theme={theme}>
      {
        icon
        ? <span className='c-ease-editor-selector-item__icon'>
            {/* <Icon
              name={icon} /> */}
            <svg
              viewBox='0 0 24 24'
              width='24px'
              height='24px'
              style={{
                strokeWidth: 1,
                transform: `scale(0.75)`,
                fill: 'none',
                overflow: 'visible'
              }}>
              <path d={icon} />
            </svg>
          </span>
        : null
      }
      <span className='c-ease-editor-selector-item__label'>
        {label}
      </span>
    </Button>
  );
}

export default EaseEditorSelectorItem;