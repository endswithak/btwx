import React, { ReactElement, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { setLayersFontFamilyThunk } from '../store/actions/layer';
import Icon from './Icon';
import { ThemeContext } from './ThemeProvider';

export interface FontFamilySelectorItemProps {
  isActive?: boolean;
  disabled?: boolean;
  icon?: string;
  iconSmall?: boolean;
  bottomDivider?: boolean;
  checkbox?: boolean;
  fontFamily: string;
  style: any;
}

interface ButtonProps {
  isActive?: boolean;
  disabled?: boolean;
  checkbox?: boolean;
}

const Button = styled.button<ButtonProps>`
  background: ${props => !props.checkbox && props.isActive ? props.theme.palette.primary : 'none'};
  .c-font-family-selector-item__icon {
    svg {
      fill: ${props => props.isActive && !props.checkbox ? props.theme.text.onPrimary : props.theme.text.lighter};
    }
  }
  .c-font-family-selector-item__icon--checkbox {
    svg {
      fill: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.lighter};
    }
  }
  .c-font-family-selector-item__label {
    color: ${props => props.checkbox ? props.theme.text.base : props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
  }
  :after {
    background: ${props => props.theme.text.lightest};
  }
  :disabled {
    background: none;
    opacity: 0.5;
    cursor: default;
    .c-font-family-selector-item__icon {
      svg {
        fill: ${props => props.theme.text.lighter};
      }
    }
    .c-font-family-selector-item__label {
      color: ${props => props.theme.text.lighter};
    }
  }
  :hover {
    background: ${props => props.isActive && !props.checkbox ? props.theme.palette.primaryHover : props.theme.palette.primary};
    .c-font-family-selector-item__icon {
      svg {
        fill: ${props => props.theme.text.onPrimary};
      }
    }
    .c-font-family-selector-item__label {
      color: ${props => props.theme.text.onPrimary};
    }
    :disabled {
      background: none;
      .c-font-family-selector-item__icon {
        svg {
          fill: ${props => props.theme.text.lighter};
        }
      }
      .c-font-family-selector-item__label {
        color: ${props => props.theme.text.lighter};
      }
    }
  }
`;

const FontFamilySelectorItem = (props: FontFamilySelectorItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const validSelection = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.layer.present.selected.every((id) => state.layer.present.byId[id].type === 'Text'));
  const dispatch = useDispatch();
  const { fontFamily, icon, bottomDivider, checkbox, isActive, iconSmall, style } = props;

  const handleClick = () => {
    if (validSelection) {
      dispatch(setLayersFontFamilyThunk({layers: selected, fontFamily}));
    }
  }

  return (
    <div style={{...style}}>
      <Button
        className={`c-font-family-selector__item ${!icon && !checkbox ? 'c-font-family-selector__item--text' : null} ${bottomDivider ? 'c-font-family-selector__item--bottom-divider' : null}`}
        isActive={isActive}
        theme={theme}
        onClick={handleClick}>
        {
          icon
          ? <span className='c-font-family-selector-item__icon'>
              <Icon
                name={icon}
                small={iconSmall} />
            </span>
          : null
        }
        <span
          className='c-font-family-selector-item__label'
          style={{
            fontFamily: fontFamily
          }}>
          {fontFamily}
        </span>
        {
          checkbox
          ? <span className='c-font-family-selector-item__icon c-font-family-selector-item__icon--checkbox'>
              <Icon
                name={isActive ? 'checkbox-checked' : 'checkbox-unchecked'}
                small />
            </span>
          : null
        }
      </Button>
    </div>
  );
}

export default FontFamilySelectorItem;