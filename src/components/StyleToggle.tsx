import React, { ReactElement } from 'react';
import IconButton from './IconButton';

interface StrokeOptionsToggleProps {
  styleEnabled: boolean;
  setStyleEnabled(styleEnabled: boolean): void;
}

const StyleToggle = (props: StrokeOptionsToggleProps): ReactElement => {
  const { styleEnabled, setStyleEnabled } = props;

  return (
    <IconButton
      onClick={() => setStyleEnabled(!styleEnabled)}
      variant='small'
      isActive={styleEnabled}
      icon='switch-off'
      activeIcon='switch-on' />
  );
}

export default StyleToggle;