import React, { useContext, ReactElement } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';

interface SidebarSectionHeadProps {
  text: string;
}

const SidebarSectionHead = (props: SidebarSectionHeadProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <div
      className='c-sidebar__section-head'
      style={{
        background: theme.background.z1,
        color: theme.text.lighter
      }}>
      { props.text }
    </div>
  );
}

export default SidebarSectionHead;