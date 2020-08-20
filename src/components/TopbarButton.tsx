import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';

interface TopbarButtonProps {
  onClick?(event: React.SyntheticEvent): void;
  isActive?: boolean;
  disabled?: boolean;
  icon?: em.Icon;
  text?: string;
  label?: string;
  hideLabel?: boolean;
  recording?: boolean;
}

interface ButtonWrapProps {
  isActive?: boolean;
  disabled?: boolean;
  recording?: boolean;
}

const ButtonWrap = styled.div<ButtonWrapProps>`
  .c-topbar-button__button {
    background: ${props => props.isActive ? props.recording ? props.theme.palette.recording : props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    box-shadow: 0 0 0 1px ${props => props.isActive ? props.recording ? props.theme.palette.recording : props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
    color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.lighter};
    .icon-fill,
    .icon-opacity {
      fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.lighter};
    }
    .icon-opacity {
      opacity: 0.5
    }
    :disabled {
      .icon-fill,
      .icon-opacity {
        fill: ${props => props.theme.text.lighter};
      }
    }
    :hover {
      background: ${props => props.isActive ? props.recording ? props.theme.palette.recordingHover : props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
      box-shadow: 0 0 0 1px ${props => props.isActive ? props.recording ? props.theme.palette.recordingHover : props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
      color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
      .icon-fill,
      .icon-opacity {
        fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
      }
      :disabled {
        background: ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
        color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.light};
        .icon-fill,
        .icon-opacity {
          fill: ${props => props.theme.text.lighter};
        }
      }
    }
  }
  .c-topbar-button__label {
    color: ${props => props.theme.text.light};
  }
`;

const TopbarButton = (props: TopbarButtonProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { onClick, text, hideLabel, isActive, disabled, label, icon, recording } = props;

  return (
    <ButtonWrap
      className={`c-topbar-button ${disabled ? 'c-topbar-button--disabled' : null}`}
      theme={theme}
      isActive={isActive}
      recording={recording}>
      <button
        className='c-topbar-button__button'
        onClick={onClick}
        disabled={disabled}>
        {
          icon
          ? <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'>
              <path className='icon-fill' d={icon.fill} />
              {
                icon.opacity
                ? <path className='icon-opacity' d={icon.opacity} />
                : null
              }
            </svg>
          : null
        }
        {
          text
          ? text
          : null
        }
      </button>
      {
        label
        ? <div className={`c-topbar-button__label ${hideLabel ? 'c-topbar-button__label--hidden' : null}`}>
            {label}
          </div>
        : null
      }
    </ButtonWrap>
  );
}

export default TopbarButton;