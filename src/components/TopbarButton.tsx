import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface TopbarButtonProps {
  onClick?(event: React.SyntheticEvent): void;
  isActive?: boolean;
  disabled?: boolean;
  icon?: string;
  text?: string;
  label?: string;
  hideLabel?: boolean;
  recording?: boolean;
  isRecord?: boolean;
  id?: string;
}

interface ButtonWrapProps {
  isActive?: boolean;
  disabled?: boolean;
  recording?: boolean;
  isRecord?: boolean;
}

const ButtonWrap = styled.div<ButtonWrapProps>`
  .c-topbar-button__button {
    background: ${props => props.isActive ? props.recording ? props.theme.palette.recording : props.theme.palette.primary : 'none' };// props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    box-shadow: none; // 0 0 0 1px ${props => props.isActive ? props.recording ? props.theme.palette.recording : props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
    color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.lighter};
    svg {
      fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.lighter};
    }
    :disabled {
      svg {
        fill: ${props => props.theme.text.lighter};
      }
    }
    :hover {
      // background: none; // ${props => props.isActive ? props.recording ? props.theme.palette.recordingHover : props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
      box-shadow: none;  // 0 0 0 1px ${props => props.recording ? props.theme.palette.recordingHover : props.isRecord ? props.theme.palette.recording : props.theme.palette.primary} inset;
      color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
      svg {
        fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base };
      }
      :disabled {
        background: ${props => props.isActive ? props.theme.palette.primary : 'none' }; // props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
        box-shadow: none;
        color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.light};
        svg {
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
  const { onClick, text, hideLabel, isActive, disabled, label, icon, recording, isRecord, id } = props;

  return (
    <ButtonWrap
      id={id ? id : null}
      className={`c-topbar-button ${disabled ? 'c-topbar-button--disabled' : null}`}
      theme={theme}
      isRecord={isRecord}
      isActive={isActive}
      recording={recording}>
      <button
        className='c-topbar-button__button'
        onClick={onClick}
        disabled={disabled}>
        {
          icon
          ? <Icon
              name={icon}
              size='small' />
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