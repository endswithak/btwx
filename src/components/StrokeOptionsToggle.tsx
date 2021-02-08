import React, { ReactElement } from 'react';
import IconButton from './IconButton';

interface StrokeOptionsToggleProps {
  showOptions: boolean;
  onClick(): void;
}

const StrokeOptionsToggle = (props: StrokeOptionsToggleProps): ReactElement => {
  const { showOptions, onClick } = props;

  return (
    <IconButton
      onClick={onClick}
      iconName='more'
      active={showOptions}
      description={showOptions ? 'hide stroke options' : 'show stroke options'}
      size='small' />
  );
}

export default StrokeOptionsToggle;