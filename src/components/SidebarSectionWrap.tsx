import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarSectionWrapProps {
  children: ReactElement | ReactElement[];
  topBorder?: boolean;
}

const SidebarSectionWrap = (props: SidebarSectionWrapProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div
      className='c-sidebar-section-wrap'
      style={{
        boxShadow: props.topBorder
        ? `0 1px 0 0 ${theme.background.z3} inset`
        : 'none',
        marginTop: props.topBorder
        ? theme.unit
        : 0,
        paddingTop: props.topBorder
        ? theme.unit
        : 0
      }}>
      { props.children }
    </div>
  );
}

export default SidebarSectionWrap;