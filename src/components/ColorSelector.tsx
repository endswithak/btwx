import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface ColorSelectorProps {
  onClick(): void;
  isActive: boolean;
}

const Button = styled.button`
  background: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.lighter};
  box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.background.z6};
  :hover {
    background: ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.text.light};
    box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.text.light};
  }
`;

const ColorSelector = (props: ColorSelectorProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <Button
      {...props}
      className='c-fill-editor__type'
      theme={theme} />
  );
}

export default ColorSelector;