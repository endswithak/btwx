import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import IconButton from './IconButton';

interface StrokeOptionsToggleProps {
  showOptions: boolean;
  onClick(): void;
}

const StrokeOptionsToggle = (props: StrokeOptionsToggleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { showOptions, onClick } = props;

  return (
    <IconButton
      onClick={onClick}
      icon='more'
      isActive={showOptions}
      variant='small' />
  );
}

export default StrokeOptionsToggle;