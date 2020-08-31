import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarSectionHeadProps {
  text: string;
  extraPadding?: boolean;
}

const SidebarSectionHead = (props: SidebarSectionHeadProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { extraPadding, text } = props;
  return (
    <div
      className={`c-sidebar-section__head ${extraPadding ? 'c-sidebar-section__head--extra' : null}`}
      style={{
        color: theme.text.lighter,
      }}>
      { text }
    </div>
  );
}

export default SidebarSectionHead;