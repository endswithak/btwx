import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarSectionLabelProps {
  text: string;
}

const SidebarSectionLabel = (props: SidebarSectionLabelProps): ReactElement => {

  return (
    <div className='c-sidebar-section__label'>
      { props.text }
    </div>
  );
}

export default SidebarSectionLabel;