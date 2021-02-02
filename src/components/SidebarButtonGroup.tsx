import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarButtonGroupProps {
  children: ReactElement | ReactElement[];
  bottomLabel?: string;
}

const SidebarButtonGroup = (props: SidebarButtonGroupProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div className='c-sidebar-button-group'>
      {props.children}
      {
        props.bottomLabel
        ? <div
            className='c-sidebar-input__bottom-label'
            style={{
              color: theme.text.base,
              marginRight: theme.unit
            }}>
            {props.bottomLabel}
          </div>
        : null
      }
    </div>
  );
}

export default SidebarButtonGroup;