import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import IconButton from './IconButton';
import Icon from './Icon';

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
      icon={Icon('switch-off')}
      activeIcon={Icon('switch-on')} />
  );
}

export default StyleToggle;