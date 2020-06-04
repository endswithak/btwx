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
  bottomLabel?: string;
  disabled?: boolean;
  selectOnMount?: boolean;
  blurOnSubmit?: boolean;
  submitOnBlur?: boolean;
  enableSelectionTool?(): ToolTypes;
  disableSelectionTool?(): ToolTypes;
}

const Input = styled.input`
  background: ${props => props.theme.background.z4};
  color: ${props => props.theme.text.base};
  :focus {
    box-shadow: 0 0 0 1px ${props => props.theme.palette.primary};
  }
`;

const SidebarInput = (props: SidebarInputProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useContext(ThemeContext);
  const { value, onChange, onSubmit, onFocus, onBlur, label, bottomLabel, disabled, selectOnMount, blurOnSubmit, submitOnBlur, enableSelectionTool, disableSelectionTool } = props;

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
    <div className={`c-sidebar-input ${disabled ? 'c-sidebar-input--disabled' : null}`}>
      <div className='c-sidebar-input__inner'>
        <form
          className={`c-sidebar-input__form ${disabled ? 'c-sidebar-input__form--disabled' : null}`}
          onSubmit={handleSubmit}>
          <Input
            ref={inputRef}
            value={value}
            onFocus={handleFocus}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className='c-sidebar-input__field'
            theme={theme} />
            {
              label
              ? <div
                  className='c-sidebar-input__label'
                  style={{
                    background: theme.background.z4,
                    color: theme.text.lighter
                  }}>
                  { label }
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
    </div>
  );
}

export default connect(
  null,
  { enableSelectionTool, disableSelectionTool }
)(SidebarInput);