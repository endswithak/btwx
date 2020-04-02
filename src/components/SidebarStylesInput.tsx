import React, { useContext, ReactElement } from 'react';
import { store } from '../store';

interface SidebarStylesInputProps {
  value: string | number;
  readOnly?: boolean;
  label?: string;
}

const SidebarStylesInput = (props: SidebarStylesInputProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <div className='c-sidebar-styles-input-wrap'>
      <input
        value={props.value}
        readOnly={props.readOnly}
        className='c-sidebar-styles-input'
        style={{
          background: theme.background.z4,
          color: theme.text.base
        }} />
        {
          props.label
          ? <div
              className='c-sidebar-styles-input__label'
              style={{
                background: theme.background.z4,
                color: theme.text.lighter
              }}>
              { props.label }
            </div>
          : null
        }
    </div>
  );
}

export default SidebarStylesInput;