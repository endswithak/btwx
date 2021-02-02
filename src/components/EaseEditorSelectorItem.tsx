/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useContext } from 'react';
import tinyColor from 'tinycolor2';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';

export interface TopbarDropdownButtonOptionProps {
  onClick(event: React.SyntheticEvent): void;
  isActive?: boolean;
  disabled?: boolean;
  icon?: string;
  label: string;
}

const Button = styled.button<TopbarDropdownButtonOptionProps>`
  background: ${props => props.isActive ? tinyColor(props.theme.text.lightest).setAlpha(0.15).toRgbString() : 'none'};
  .c-ease-editor-selector-item__icon {
    svg {
      stroke: ${props => props.theme.text.lighter};
    }
  }
  .c-ease-editor-selector-item__label {
    color: ${props => props.theme.text.base};
  }
  :hover {
    background: ${props => props.theme.palette.primary};
    .c-ease-editor-selector-item__icon {
      svg {
        stroke: ${props => props.theme.text.onPrimary};
      }
    }
    .c-ease-editor-selector-item__label {
      color: ${props => props.theme.text.onPrimary};
    }
  }
`;

export interface EaseEditorSelectorItemProps {
  value: string;
  label: string;
  icon?: string;
  onClick(): any;
}

const EaseEditorSelectorItem = (props: EaseEditorSelectorItemProps & { isActive: boolean; setIsOpen(isOpen: boolean): void }): ReactElement => {
  const theme = useContext(ThemeContext);
  const { label, icon, isActive, onClick, setIsOpen } = props;

  const handleClick = () => {
    onClick();
    setIsOpen(false);
  }

  return (
    <Button
      className='c-ease-editor-selector__item'
      {...props}
      onClick={handleClick}
      theme={theme}>
      {
        icon
        ? <span className='c-ease-editor-selector-item__icon'>
            {/* <Icon
              name={icon} /> */}
            <svg
              viewBox='0 0 24 24'
              width='24px'
              height='24px'
              style={{
                strokeWidth: 1,
                transform: `scale(0.75)`,
                fill: 'none',
                overflow: 'visible'
              }}>
              <path d={icon} />
            </svg>
          </span>
        : null
      }
      <span className='c-ease-editor-selector-item__label'>
        {label}
      </span>
    </Button>
  );
}

export default EaseEditorSelectorItem;