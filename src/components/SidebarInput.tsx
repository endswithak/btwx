import React, { useContext, ReactElement, useState, useRef, useEffect } from 'react';
import { store } from '../store';

interface SidebarInputProps {
  value: string | number;
  onChange: any;
  onSubmit(value: string | number): void;
  label?: string;
  disabled?: boolean;
}

const SidebarInput = (props: SidebarInputProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const globalState = useContext(store);
  const { theme } = globalState;

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>) => {
    e.preventDefault();
    props.onSubmit(props.value);
  };

  return (
    <div className='c-sidebar-input'>
      <div className='c-sidebar-input__inner'>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={props.value}
            onChange={props.onChange}
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