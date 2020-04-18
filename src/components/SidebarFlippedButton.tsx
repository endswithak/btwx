import React, { useContext, ReactElement } from 'react';
import { store } from '../store';

interface SidebarFlippedButtonProps {
  text: string | number;
  onClick: any;
  active: boolean;
  disabled?: boolean;
}

const SidebarFlippedButton = (props: SidebarFlippedButtonProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <div className='c-sidebar-input'>
      <button
        className='c-sidebar-input__field'
        onClick={props.onClick}
        style={{
          background: props.active ? theme.palette.primary : theme.background.z4,
          color: props.active ? theme.text.onPrimary : props.disabled ? theme.text.lighter : theme.text.base
        }}>
        { props.text }
      </button>
    </div>
  );
}

export default SidebarFlippedButton;