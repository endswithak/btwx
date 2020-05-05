import React, { useContext, ReactElement, useState, useRef, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarInputProps {
  value: string | number;
  onChange: any;
  onSubmit(value: string | number): void;
  label?: string;
  disabled?: boolean;
  selectOnMount?: boolean;
}

const SidebarInput = (props: SidebarInputProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useContext(ThemeContext);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>) => {
    e.preventDefault();
    props.onSubmit(props.value);
  };

  const handleChange = (e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>) => {
    props.onChange(e);
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
            onChange={handleChange}
            onBlur={handleSubmit}
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