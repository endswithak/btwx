import React, { ReactElement } from 'react';
import ToggleIconButton from './ToggleIconButton';

interface StrokeOptionsToggleProps {
  style: 'fill' | 'stroke' | 'shadow' | 'blur';
  styleEnabled: boolean;
  setStyleEnabled(styleEnabled: boolean): void;
}

const StyleToggle = ({
  style,
  styleEnabled,
  setStyleEnabled
}: StrokeOptionsToggleProps): ReactElement => (
  <ToggleIconButton
    value={styleEnabled}
    type='checkbox'
    onChange={() => setStyleEnabled(!styleEnabled)}
    size='small'
    checked={styleEnabled}
    label={style}
    iconName='switch-off'
    activeIconName='switch-on' />
);

export default StyleToggle;