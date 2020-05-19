import React, { useContext, ReactElement, useState, useRef, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarInputProps {
  value: string | number;
  onChange(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  onSubmit(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  onFocus?(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  onBlur?(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  label?: string;
  disabled?: boolean;
  selectOnMount?: boolean;
  blurOnSubmit?: boolean;
}

const SidebarInput = (props: SidebarInputProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useContext(ThemeContext);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>) => {
    e.preventDefault();
    props.onSubmit(e);
    if (props.blurOnSubmit) {
      inputRef.current.blur();
    }
  };

  const handleChange = (e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>) => {
    props.onChange(e);
  };

  const handleFocus = (e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>) => {
    props.onFocus(e);
    inputRef.current.select();
  };

  const handleBlur = (e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>) => {
    props.onBlur(e);
  };

  useEffect(() => {
    if (props.selectOnMount) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  return (
    <div className='c-sidebar-input'>
      <div className='c-sidebar-input__inner'>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={props.value}
            onFocus={handleFocus}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={props.disabled}
            className='c-sidebar-input__field'
            style={{
              background: theme.background.z4,
              color: theme.text.base
            }} />
        </form>
        {
          props.label
          ? <div
              className='c-sidebar-input__label'
              style={{
                background: theme.background.z4,
                color: theme.text.lighter
              }}>
              { props.label }
            </div>
          : null
        }
      </div>
    </div>
  );
}

export default SidebarInput;