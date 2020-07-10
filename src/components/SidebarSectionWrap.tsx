import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarSectionWrapProps {
  children: ReactElement | ReactElement[];
  bottomBorder?: boolean;
  whiteSpace?: boolean;
  style?: any;
}

const SidebarSectionWrap = (props: SidebarSectionWrapProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { children, bottomBorder, whiteSpace, style } = props;

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
        ...style
      }}>
      { children }
    </div>
  );
}

export default SidebarSectionWrap;