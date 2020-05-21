import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarToggleButtonProps {
  text?: string | number;
  onClick: any;
  active: boolean;
  disabled?: boolean;
  children?: React.ReactElement | React.ReactElement[];
}

const SidebarToggleButton = (props: SidebarToggleButtonProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div className={`c-sidebar-input ${props.disabled ? 'c-sidebar-input--disabled' : null}`}>
      <button
        className={`c-sidebar-input__field ${props.disabled ? 'c-sidebar-input__field--disabled' : null}`}
        onClick={props.onClick}
        style={{
          background: props.active ? theme.palette.primary : theme.background.z4,
          color: props.active ? theme.text.onPrimary : props.disabled ? theme.text.lighter : theme.text.base
        }}
        disabled={props.disabled}>
        { props.text }
        { props.children }
      </button>
    </div>
  );
}

export default SidebarToggleButton;