import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
import Button from './Button';

interface GroupProps {
  disabled: boolean;
}

const StyledDiv = styled.div<GroupProps>`
  background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  box-shadow: 0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
  opacity: ${props => props.disabled ? 0.5 : 1};
  :hover {
    box-shadow:  0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
  }
`;

export interface ButtonGroupProps {
  buttons: {
    text?: string;
    icon?: string;
    active?: boolean;
    onClick?: any;
  }[];
  disabled?: boolean;
  ariaLabel?: string;
}

const ButtonGroup = (props: ButtonGroupProps): ReactElement => {
  const { buttons, disabled, ariaLabel } = props;
  const theme = useContext(ThemeContext);

  return (
    <StyledDiv
      className='c-button-group'
      theme={theme}
      disabled={disabled}
      role='group'
      aria-label={ariaLabel}>
      {
        buttons.map((button, index) => (
          <Button
            {...button}
            key={index}
            disabled={disabled}
            groupButton />
        ))
      }
    </StyledDiv>
  );
}

export default ButtonGroup;