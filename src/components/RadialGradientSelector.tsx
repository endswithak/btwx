import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface RadialGradientSelectorProps {
  onClick(): void;
  isActive: boolean;
}

const RadialGradientSelector = (props: RadialGradientSelectorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { onClick, isActive } = props;

  return (
    <button
      onClick={onClick}
      className='c-fill-editor__type'
      style={{
        background: isActive
        ? `radial-gradient(${theme.palette.primary}, ${theme.background.z1})`
        : `radial-gradient(${theme.background.z6}, ${theme.background.z1})`,
        boxShadow: isActive
        ? `0 0 0 1px ${theme.palette.primary} inset`
        : `0 0 0 1px ${theme.background.z6} inset`
      }} />
  );
}

export default RadialGradientSelector;