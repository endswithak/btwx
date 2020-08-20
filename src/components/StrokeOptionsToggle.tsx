import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import IconButton from './IconButton';
import Icon from './Icon';

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
      icon={Icon('gear')}
      isActive={showOptions}
      variant='small' />
  );
}

export default StrokeOptionsToggle;