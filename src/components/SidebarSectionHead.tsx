import React, { useContext, ReactElement } from 'react';
import { store } from '../store';

interface SidebarSectionHeadProps {
  text: string;
}

const SidebarSectionHead = (props: SidebarSectionHeadProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <div
      className='c-sidebar-section__head'
      style={{
        background: theme.background.z1,
        color: theme.text.lighter
      }}>
      { props.text }
    </div>
  );
}

export default SidebarSectionHead;