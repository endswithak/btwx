import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarSectionLabelProps {
  text: string;
}

const SidebarSectionLabel = (props: SidebarSectionLabelProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div
      className='c-sidebar-section__label'
      style={{
        color: theme.text.base
      }}>
      { props.text }
    </div>
  );
}

export default SidebarSectionLabel;