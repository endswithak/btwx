import React, { ReactElement } from 'react';
import ToggleIconButton from './ToggleIconButton';

interface StrokeOptionsToggleProps {
  showOptions: boolean;
  onClick(): void;
}

const StrokeOptionsToggle = (props: StrokeOptionsToggleProps): ReactElement => {
  const { showOptions, onClick } = props;

  return (
    <ToggleIconButton
      value={showOptions}
      type='checkbox'
      onChange={onClick}
      iconName='more'
      checked={showOptions}
      label='stroke options'
      size='small' />
  );
}

export default StrokeOptionsToggle;