/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { clipboard } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import { setCanvasFocusing } from '../store/actions/canvasSettings';

interface SidebarInputProps {
  value: string | number;
  onChange(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  onSubmit?(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  onFocus?(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  onBlur?(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  id?: string;
  label?: string;
  leftLabel?: string;
  bottomLabel?: string;
  disabled?: boolean;
  selectOnMount?: boolean;
  submitOnBlur?: boolean;
  disableSelectionToolToggle?: boolean;
  removedOnSubmit?: boolean;
  manualCanvasFocus?: boolean;
  placeholder?: string;
  isSearch?: boolean;
}

interface InputProps {
  isSearch: boolean;
}

const Input = styled.div<InputProps>`
  .c-sidebar-input__field {
    background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    color: ${props => props.theme.text.base};
    box-shadow: 0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
    :focus {
      box-shadow: ${props => props.isSearch ? `0 0 0 0` : `0 0 0 1px`} ${props => props.theme.palette.primary} inset;
    }
    :hover {
      box-shadow:  ${props => props.isSearch ? `0 0 0 0` : `0 0 0 1px`} ${props => props.isSearch ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
      :focus {
        box-shadow: ${props => props.isSearch ? `0 0 0 0` : `0 0 0 1px`} ${props => props.theme.palette.primary} inset;
      }
    }
  }
  .c-sidebar-input__label {
    background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    color: ${props => props.theme.text.lighter};
  }
  .c-sidebar-input__bottom-label {
    color: ${props => props.theme.text.base};
  }
`;

const SidebarInput = (props: SidebarInputProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useContext(ThemeContext);
  const { id, value, onChange, onSubmit, placeholder, isSearch, onFocus, onBlur, manualCanvasFocus, removedOnSubmit, label, leftLabel, bottomLabel, disabled, selectOnMount, submitOnBlur } = props;
  const canvasFocusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const dispatch = useDispatch();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleChange = (e: any) => {
    onChange(e);
  };

  const handleMouseDown = (event: any) => {
    if (event.target !== inputRef.current) {
      if (inputRef.current) {
        inputRef.current.blur();
      }
      if (!manualCanvasFocus) {
        dispatch(setCanvasFocusing({focusing: true}));
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('keydown', handleKeyDown);
      }
    }
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Escape' || event.key === 'Tab') {
      if (inputRef.current) {
        inputRef.current.blur();
      }
      if (!manualCanvasFocus) {
        dispatch(setCanvasFocusing({focusing: true}));
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('keydown', handleKeyDown);
      }
    }
    if (event.key === 'Enter') {
      if (removedOnSubmit) {
        if (!manualCanvasFocus) {
          dispatch(setCanvasFocusing({focusing: true}));
          document.removeEventListener('mousedown', handleMouseDown);
          document.removeEventListener('keydown', handleKeyDown);
        }
      } else {
        inputRef.current.select();
      }
    }
    if (event.key === 'c' && event.metaKey) {
      clipboard.writeText(JSON.stringify(value));
    }
    if (event.key === 'v' && event.metaKey) {
      try {
        const text = clipboard.readText();
        inputRef.current.value = JSON.parse(text);
        handleChange(event);
      } catch(error) {
        return;
      }
    }
  }

  const handleFocus = (e: any) => {
    if (onFocus) {
      onFocus(e);
    }
    if (canvasFocusing && !manualCanvasFocus) {
      dispatch(setCanvasFocusing({focusing: false}));
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('keydown', handleKeyDown);
    }
  };

  const handleBlur = (e: any) => {
    if (onBlur) {
      onBlur(e);
    }
    if (submitOnBlur) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (selectOnMount) {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, []);

  return (
    <Input
      isSearch={isSearch}
      className={`c-sidebar-input ${disabled ? 'c-sidebar-input--disabled' : null}`}
      theme={theme}>
      <div className='c-sidebar-input__inner'>
        <form
          className={`c-sidebar-input__form ${disabled ? 'c-sidebar-input__form--disabled' : null}`}
          onSubmit={handleSubmit}>
          <input
            id={id}
            ref={inputRef}
            value={value}
            onFocus={handleFocus}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            className={
              `c-sidebar-input__field ${
                label
                ? 'c-sidebar-input__field--label'
                : null
              } ${
                leftLabel
                ? 'c-sidebar-input__field--left-label'
                : null
              }`
            } />
            {
              label
              ? <div className='c-sidebar-input__label c-sidebar-input__label--right'>
                  { label }
                </div>
              : null
            }
            {
              leftLabel
              ? <div className='c-sidebar-input__label c-sidebar-input__label--left'>
                  { leftLabel }
                </div>
              : null
            }
        </form>
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
    </Input>
  );
}

export default SidebarInput;