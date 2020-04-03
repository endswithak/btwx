import React, { useContext, ReactElement } from 'react';
import { store } from '../store';

interface SidebarSectionLabelProps {
  text: string;
}

const SidebarSectionLabel = (props: SidebarSectionLabelProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <div
      className='c-sidebar-section__label'
      style={{
        background: theme.background.z1,
        color: theme.text.base
      }}>
      { props.text }
    </div>
  );
}

export default SidebarSectionLabel;