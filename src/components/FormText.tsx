/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
// import FormControlContext from './FormControlContext';

const StyledSpan = styled.span`
  color: ${props => props.theme.text.base};
  fill: ${props => props.theme.text.base};
  &.c-form-text--active {
    color: ${props => props.theme.palette.primary};
    fill: ${props => props.theme.palette.primary};
  }
  &.c-form-text--success {
    color: ${props => props.theme.palette.success};
    fill: ${props => props.theme.palette.success};
  }
  &.c-form-text--error {
    color: ${props => props.theme.palette.error};
    fill: ${props => props.theme.palette.error};
  }
  &.c-form-text--warn {
    color: ${props => props.theme.palette.warn};
    fill: ${props => props.theme.palette.warn};
  }
`;

interface FormTextProps {
  children: any;
  size?: Btwx.SizeVariant;
  colorVariant?: Btwx.ColorVariant;
}

const FormText = (props: FormTextProps): ReactElement => {
  // const fc = useContext(FormControlContext);
  const theme = useContext(ThemeContext);
  const { children, size, colorVariant } = props;

  return (
    <StyledSpan
      theme={theme}
      className={`c-form-text ${
        size
        ? `c-form-text--${size}`
        : ''
      } ${
        colorVariant
        ? `c-form-text--${colorVariant}`
        : ''
      }`}>
      { children }
    </StyledSpan>
  );
};

export default FormText;