import React, { useContext, ReactElement } from 'react';
import { store } from '../store';
import Checkbox from 'rc-checkbox';

interface SidebarCheckboxProps {
  checked: boolean;
  onChange?(e: Event): void;
}

const SidebarCheckbox = (props: SidebarCheckboxProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <Checkbox
      checked={props.checked}
      onChange={props.onChange} />
  );
}

export default SidebarCheckbox;