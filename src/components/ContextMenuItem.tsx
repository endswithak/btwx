import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface ContextMenuItemProps {
  text: string;
  disabled: boolean;
  checked?: boolean;
  onClick(): void;
  onMouseEnter?(): void;
  onMouseLeave?(): void;
}

interface ItemProps {
  isDisabled: boolean;
}

const Item = styled.div<ItemProps>`
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer' };
  button {
    opacity: ${props => props.isDisabled ? 0.5 : 1 };
    pointer-events: ${props => props.isDisabled ? 'none' : 'auto' };
    color: ${props => props.theme.text.base};
    svg {
      fill: ${props => props.theme.text.base};
    }
    :hover {
      background: ${props => props.isDisabled ? 'none' : props.theme.palette.primary};
      color: ${props => props.isDisabled ? props.theme.text.base : props.theme.text.onPalette.primary};
      svg {
        fill: ${props => props.isDisabled ? props.theme.text.base : props.theme.text.onPalette.primary};
      }
    }
  }
`;

const ContextMenuItem = (props: ContextMenuItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { text, onClick, disabled, onMouseEnter, onMouseLeave, checked } = props;

  return (
    <Item
      className={`c-context-menu__item ${checked ? 'c-context-menu__item--checked' : null}`}
      onMouseEnter={onMouseEnter}
      isDisabled={disabled}
      onMouseLeave={onMouseLeave}
      theme={theme}>
      <button onClick={onClick}>
        {
          checked
          ? <Icon
              name='check'
              size='small' />
          : null
        }
        <span>{text}</span>
      </button>
    </Item>
  );
}

export default ContextMenuItem;