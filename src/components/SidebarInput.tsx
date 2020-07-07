import React, { useContext, ReactElement, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { ToolTypes } from '../store/actionTypes/tool';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';

interface SidebarInputProps {
  value: string | number;
  onChange(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  onSubmit(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  onFocus?(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  onBlur?(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  label?: string;
  leftLabel?: string;
  bottomLabel?: string;
  disabled?: boolean;
  selectOnMount?: boolean;
  blurOnSubmit?: boolean;
  submitOnBlur?: boolean;
  enableSelectionTool?(): ToolTypes;
  disableSelectionTool?(): ToolTypes;
}

const Input = styled.div`
  .c-sidebar-input__field {
    background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    color: ${props => props.theme.text.base};
    box-shadow: 0 0 0 1px ${props => props.theme.background.z4} inset;
    :focus {
      box-shadow: 0 0 0 1px ${props => props.theme.palette.primary} inset;
    }
    :hover {
      box-shadow: 0 0 0 1px ${props => props.theme.background.z6} inset;
      :focus {
        box-shadow: 0 0 0 1px ${props => props.theme.palette.primaryHover} inset;
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
  const { value, onChange, onSubmit, onFocus, onBlur, label, leftLabel, bottomLabel, disabled, selectOnMount, blurOnSubmit, submitOnBlur, enableSelectionTool, disableSelectionTool } = props;

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>) => {
    e.preventDefault();
    onSubmit(e);
    if (blurOnSubmit) {
      inputRef.current.blur();
    }
  };

  const handleChange = (e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>) => {
    onChange(e);
  };

  const handleFocus = (e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(e);
    }
    disableSelectionTool();
  };

  const handleBlur = (e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e);
    }
    if (submitOnBlur) {
      handleSubmit(e);
    }
    enableSelectionTool();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current.select();
    }
  };

  useEffect(() => {
    if (selectOnMount) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  return (
    <Input
      className={`c-sidebar-input ${disabled ? 'c-sidebar-input--disabled' : null}`}
      theme={theme}>
      <div className='c-sidebar-input__inner'>
        <form
          className={`c-sidebar-input__form ${disabled ? 'c-sidebar-input__form--disabled' : null}`}
          onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={value}
            onFocus={handleFocus}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            disabled={disabled}
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

export default connect(
  null,
  { enableSelectionTool, disableSelectionTool }
)(SidebarInput);