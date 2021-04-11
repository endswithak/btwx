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

interface ButtonProps {
  isActive: boolean;
  disabled?: boolean;
}

const Button = styled.button<ButtonProps>`
  color: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.base};
  svg {
    fill: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.lighter};
    :hover {
      fill: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.light};
    }
  }
`;

interface EaseEditorSelectorInputProps {
  text: string;
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
}

const EaseEditorSelectorInput = (props: EaseEditorSelectorInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { text, isOpen, setIsOpen } = props;

  const handleClick = () => {
    setIsOpen(!isOpen);
  }

  return (
    <Button
      theme={theme}
      isActive={isOpen}
      className='c-ease-editor-selector__input'
      onClick={handleClick}>
      <span>{ text }</span>
      <span>
        <Icon
          size='small'
          name='thicc-chevron-down' />
      </span>
    </Button>
  );
}

export default EaseEditorSelectorInput;