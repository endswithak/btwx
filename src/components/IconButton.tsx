import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface IconButtonProps {
  onClick(): void;
  disabled?: boolean;
  isActive?: boolean;
  icon: string;
  variant?: 'small' | 'medium' | 'large';
  remove?: boolean;
  activeIcon?: string;
  theme?: Btwx.Theme;
}

const Button = styled.button<IconButtonProps>`
  svg {
    fill: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.lighter};
  }
  :hover {
    svg {
      fill: ${props => props.remove ? props.theme.palette.recording : props.isActive ? props.theme.palette.primaryHover : props.theme.text.base};
    }
    :disabled {
      svg {
        fill: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.lighter};
      }
      cursor: default;
    }
  }
  :disabled {
    opacity: 0.5;
  }
`;

const IconButton = (props: IconButtonProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { onClick, disabled, isActive, icon, activeIcon, variant } = props;

  return (
    <Button
      className={`c-icon-button ${variant ? 'c-icon-button--' + variant : null}`}
      {...props}
      theme={theme}>
      <Icon name={activeIcon && isActive ? activeIcon : icon} />
    </Button>
  );
}

export default IconButton;