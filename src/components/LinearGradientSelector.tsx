import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface LinearGradientSelectorProps {
  onClick(): void;
  isActive: boolean;
}

const Button = styled.button`
  background: linear-gradient(to top, ${props => props.isActive ? props.theme.palette.primary : props.theme.text.light}, ${props => props.theme.background.z1});
  box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.background.z6};
  :hover {
    background: linear-gradient(to top, ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.text.base}, ${props => props.theme.background.z1});
    box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.text.base};
  }
`;

const LinearGradientSelector = (props: LinearGradientSelectorProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <Button
      {...props}
      className='c-fill-editor__type'
      theme={theme} />
  );
}

export default LinearGradientSelector;