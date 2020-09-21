import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarProps {
  children: ReactElement | ReactElement[];
  width: number;
  position: 'left' | 'right';
  header?: boolean;
  headerChildren?: ReactElement | ReactElement[];
}

const Sidebar = (props: SidebarProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { children, width, position, header, headerChildren } = props;

  return (
    <div
      id={`sidebar-${props.position}`}
      className='c-sidebar'
      style={{
        width: width,
        background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
        boxShadow: position === 'left' ? `1px 0 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}` : `-1px 0 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
      }}>
      {
        header
        ? <>
            { headerChildren }
          </>
        : null
      }
      <div
        id={`sidebar-scroll-${position}`}
        className='c-sidebar__scroll'>
        { children }
      </div>
    </div>
  );
}

export default Sidebar;