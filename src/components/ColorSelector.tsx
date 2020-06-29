import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface ColorSelectorProps {
  onClick(): void;
  isActive: boolean;
}

const ColorSelector = (props: ColorSelectorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { onClick, isActive } = props;

  return (
    <button
      onClick={onClick}
      className='c-fill-editor__type'
      style={{
        background: isActive
        ? theme.palette.primary
        : theme.background.z6,
        boxShadow: isActive
        ? `0 0 0 1px ${theme.palette.primary} inset`
        : `0 0 0 1px ${theme.background.z6} inset`
      }} />
  );
}

export default ColorSelector;