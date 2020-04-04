import React, { useContext, ReactElement } from 'react';
import { store } from '../store';

interface SidebarInputProps {
  value: string | number;
  onChange(e: React.SyntheticEvent<HTMLInputElement>): void;
  readOnly?: boolean;
  label?: string;
}

const SidebarInput = (props: SidebarInputProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <div className='c-sidebar-input'>
      <div className='c-sidebar-input__inner'>
        <input
          value={props.value}
          onChange={props.onChange}
          className='c-sidebar-input__field'
          style={{
            background: theme.background.z4,
            color: theme.text.base
          }} />
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