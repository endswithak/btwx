import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface IconButtonProps {
  onClick(): void;
  disabled?: boolean;
  active?: boolean;
  icon: string;
  size?: Btwx.SizeVariant;
  remove?: boolean;
  activeIcon?: string;
  description?: string;
  theme?: Btwx.Theme;
}

const Button = styled.button<IconButtonProps>`
  svg {
    fill: ${props => props.active ? props.theme.palette.primary : props.theme.text.lighter};
  }
  :hover {
    svg {
      fill: ${props => props.remove ? props.theme.palette.error : props.active ? props.theme.palette.primary : props.theme.text.base};
    }
    :disabled {
      svg {
        fill: ${props => props.active ? props.theme.palette.primary : props.theme.text.lighter};
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
  const { onClick, disabled, active, icon, activeIcon, size, description } = props;

  return (
    <Button
      {...props}
      className={`c-icon-button ${size ? `c-icon-button--${size}` : ''}`}
      theme={theme}
      name={icon}>
      <Icon
        name={activeIcon && active ? activeIcon : icon}
        size={size} />
      <span>{description ? description : icon}</span>
    </Button>
  );
}

export default IconButton;