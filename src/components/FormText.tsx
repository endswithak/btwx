/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
import FormControlContext from './FormControlContext';

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
`;

interface FormTextProps {
  children: any;
}

const FormText = (props: FormTextProps): ReactElement => {
  const fc = useContext(FormControlContext);
  const theme = useContext(ThemeContext);
  const { children } = props;

  return (
    <StyledSpan
      theme={theme}
      className={`c-form-text ${
        fc.size
        ? `c-form-text--${fc.size}`
        : ''
      } ${
        fc.isValid
        ? 'c-form-text--success'
        : ''
      } ${
        fc.isInvalid
        ? 'c-form-text--error'
        : ''
      } ${
        fc.isActive
        ? 'c-form-text--active'
        : ''
      }`}>
      { children }
    </StyledSpan>
  );
};

export default FormText;