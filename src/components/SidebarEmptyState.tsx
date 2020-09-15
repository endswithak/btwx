import React, { ReactElement, useContext } from 'react';
import Icon from './Icon';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';

interface SidebarEmptyStateProps {
  icon?: string;
  text: string | ReactElement;
  detail?: string | ReactElement;
  action?: boolean;
  actionActive?: boolean;
  actionDisabled?: boolean;
  actionText?: string;
  actionIcon?: string;
  actionClick?(): void;
}

interface ButtonProps {
  isActive: boolean;
}

const Button = styled.button<ButtonProps>`
  cursor: pointer;
  background: ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
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
      background: ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
      box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
      color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
      svg {
        fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
      }
      :disabled {
        background: ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
        color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.light};
        svg {
          fill: ${props => props.theme.text.lighter};
        }
      }
    }
  :disabled {
    cursor: default;
  }
`;

const SidebarEmptyState = (props: SidebarEmptyStateProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { icon, text, detail, action, actionText, actionIcon, actionClick, actionActive, actionDisabled } = props;
  return (
    <div className='c-sidebar__empty-state'>
      <div className='c-sidebar-empty-state__inner'>
        {
          icon
          ? <div className='c-sidebar-empty-state__icon'>
              <Icon
                name={icon}
                style={{
                  fill: theme.text.lightest
                }} />
            </div>
          : null
        }
        <div
          className='c-sidebar-empty-state__text'
          style={{
            color: theme.text.lighter
          }}>
          { text }
        </div>
        {
          detail
          ? <div
              className='c-sidebar-empty-state__detail'
              style={{
                color: theme.text.lightest
              }}>
              { detail }
            </div>
          : null
        }
        {
          action
          ? <div className='c-sidebar-empty-state__action'>
              <Button
                theme={theme}
                onClick={actionClick}
                disabled={actionDisabled}
                isActive={actionActive}>
                {
                  actionText
                  ? actionText
                  : null
                }
                {
                  actionIcon
                  ? <Icon name={actionIcon} />
                  : null
                }
              </Button>
            </div>
          : null
        }
      </div>
    </div>
  );
}

export default SidebarEmptyState;