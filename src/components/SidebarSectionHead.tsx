import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarSectionHeadProps {
  text: string;
}

const SidebarSectionHead = (props: SidebarSectionHeadProps): ReactElement => {
  const theme = useContext(ThemeContext);
  return (
    <div
      className='c-sidebar-section__head'
      style={{
        color: theme.text.lighter
      }}>
      { props.text }
    </div>
  );
}

export default SidebarSectionHead;