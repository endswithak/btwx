import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import IconButton from './IconButton';

interface StrokeOptionsToggleProps {
  styleEnabled: boolean;
  setStyleEnabled(styleEnabled: boolean): void;
}

const StyleToggle = (props: StrokeOptionsToggleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { styleEnabled, setStyleEnabled } = props;

  return (
    <IconButton
      onClick={() => setStyleEnabled(!styleEnabled)}
      variant='small'
      isActive={styleEnabled}
      icon='M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'
      activeIcon='M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z' />
  );
}

export default StyleToggle;