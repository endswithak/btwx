import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarSectionWrapProps {
  children: ReactElement | ReactElement[];
  bottomBorder?: boolean;
  whiteSpace?: boolean;
  bg?: boolean;
  style?: any;
}

const SidebarSectionWrap = (props: SidebarSectionWrapProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { children, bottomBorder, whiteSpace, style, bg } = props;

  return (
    <div
      className='c-sidebar-section-wrap'
      style={{
        boxShadow: bottomBorder
        ? `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
        : 'none',
        paddingTop: whiteSpace
        ? theme.unit
        : 0,
        paddingBottom: whiteSpace
        ? theme.unit
        : 0,
        background: bg
        ? theme.name === 'dark' ? theme.background.z3 : theme.background.z0
        : 'none',
        ...style
      }}>
      { children }
    </div>
  );
}

export default SidebarSectionWrap;