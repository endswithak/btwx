import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';

interface IconButtonProps {
  onClick(): void;
  disabled?: boolean;
  isActive?: boolean;
  icon: em.Icon;
  variant?: 'small' | 'medium' | 'large';
  activeIcon?: em.Icon;
  theme?: em.Theme;
}

const Button = styled.button<IconButtonProps>`
  svg {
    fill: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.lighter};
  }
  :hover {
    svg {
      fill: ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.text.base};
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
      <svg
        viewBox='0 0 24 24'
        width='24px'
        height='24px'>
        <path d={activeIcon && isActive ? activeIcon.fill : icon.fill} />
        {
          icon.opacity
          ? <path className='icon-opacity' d={activeIcon && isActive ? activeIcon.opacity : icon.opacity} />
          : null
        }
      </svg>
    </Button>
  );
}

export default IconButton;