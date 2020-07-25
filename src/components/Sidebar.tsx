import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarProps {
  children: ReactElement | ReactElement[];
  width: number;
  position: 'left' | 'right';
}

const Sidebar = (props: SidebarProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div
      id={`sidebar-${props.position}`}
      className='c-sidebar'
      style={{
        width: props.width,
        background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
        boxShadow: props.position === 'left' ? `1px 0 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}` : `-1px 0 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
      }}>
      <div className='c-sidebar__scroll'>
        { props.children }
      </div>
    </div>
  );
}

export default Sidebar;