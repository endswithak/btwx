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
    <aside
      id={`sidebar-${props.position}`}
      className={`c-sidebar c-sidebar--${position}`}
      style={{
        width: width
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
    </aside>
  );
}

export default Sidebar;