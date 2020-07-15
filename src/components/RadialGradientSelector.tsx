import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface RadialGradientSelectorProps {
  onClick(): void;
  isActive: boolean;
}

const Button = styled.button<RadialGradientSelectorProps>`
  background: radial-gradient(${props => props.isActive ? props.theme.palette.primary : props.theme.text.light}, ${props => props.theme.background.z1});
  box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.text.lighter};
  :hover {
    background: radial-gradient(${props => props.isActive ? props.theme.palette.primaryHover : props.theme.text.base}, ${props => props.theme.background.z1});
    box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.text.light};
  }
`;

const RadialGradientSelector = (props: RadialGradientSelectorProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <Button
      {...props}
      className='c-fill-editor__type'
      theme={theme} />
  );
}

export default RadialGradientSelector;