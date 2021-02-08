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
      size='small'
      active={styleEnabled}
      iconName='switch-off'
      activeIconName='switch-on' />
  );
}

export default StyleToggle;