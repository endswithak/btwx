import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

const ContextMenuDivider = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div className='c-context-menu__divider'>
      <div style={{
        background: theme.text.lightester
      }} />
    </div>
  );
}

export default ContextMenuDivider;