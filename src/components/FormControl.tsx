/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, forwardRef, useEffect, useState, useMemo, ReactElement } from 'react';
import tinyColor from 'tinycolor2';
import styled from 'styled-components';
import { AsProp, RefForwardingComponent } from '../utils';
import { ThemeContext } from './ThemeProvider';
import FormControlContext from './FormControlContext';
import FormGroupContext from './FormGroupContext';
import FormControlAddon from './FormControlAddon';

type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export interface FormControlProps extends AsProp {
  id?: string;
  type?: string;
  value?: string | string[] | number;
  disabled?: boolean;
  placeholder?: string;
  size?: Btwx.SizeVariant;
  htmlSize?: number;
  isValid?: boolean;
  isInvalid?: boolean;
  left?: ReactElement;
  right?: ReactElement;
  leftReadOnly?: boolean;
  rightReadOnly?: boolean;
  onChange?: React.ChangeEventHandler<FormControlElement>;
  onFocus?: React.FocusEventHandler<FormControlElement>;
  onBlur?: React.FocusEventHandler<FormControlElement>;
}

interface StyledComponentProps {
  height: number;
  htmlSize?: number;
}

const StyledComponent = styled.input<StyledComponentProps>`
  /* background: ${props => tinyColor(props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0).setAlpha(0.77).toRgbString()}; */
  -webkit-appearance: none;
  background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  color: ${props => props.theme.text.light};
  box-shadow: 0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
  height: ${props => props.htmlSize ? props.htmlSize * props.height : props.height }px;
  ~ span {
    .c-form-text {
      color: ${props => props.theme.text.lighter};
      fill: ${props => props.theme.text.lighter};
    }
  }
  :hover {
    color: ${props => props.theme.text.base};
    box-shadow: 0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
    ~ span {
      .c-form-text {
        color: ${props => props.theme.text.light};
        fill: ${props => props.theme.text.light};
      }
    }
    ::-webkit-slider-runnable-track {
      background: linear-gradient(to right, ${props => props.theme.palette.primaryHover} ${props => props.max ? ((props.min ? props.value - props.min : props.value) / (props.min ? props.max - props.min : props.max)) * 100 : props.value}%, ${props => props.theme.background.z4} ${props => props.max ? ((props.min ? props.value - props.min : props.value) / (props.min ? props.max - props.min : props.max)) * 100 : props.value}%);
    }
  }
  :focus,
  :focus :hover {
    outline: none;
    color: ${props => props.theme.text.base};
    box-shadow: 0 0 0 1px ${props => props.theme.palette.primary} inset;
    ~ span {
      .c-form-text {
        color: ${props => props.theme.palette.primary};
        fill: ${props => props.theme.palette.primary};
      }
    }
  }
  :disabled,
  :disabled :hover {
    color: ${props => props.theme.text.lighter};
    /* background: ${props => tinyColor(props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0).setAlpha(0.77).toRgbString()}; */
    background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    box-shadow: 0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
    opacity: 0.5;
    ~ span {
      .c-form-text {
        color: ${props => props.theme.text.lighter};
        fill: ${props => props.theme.text.lighter};
        opacity: 0.5;
      }
    }
    ::-webkit-slider-runnable-track {
      cursor: inherit;
    }
  }
  ::selection {
    background: ${props => props.theme.palette.primary};
  }
  ::-webkit-slider-runnable-track {
    width: 100%;
    height: ${props => props.theme.unit}px;
    cursor: pointer;
    background: linear-gradient(to right, ${props => props.theme.palette.primary} ${props => props.max ? ((props.min ? props.value - props.min : props.value) / (props.min ? props.max - props.min : props.max)) * 100 : props.value}%, ${props => props.theme.background.z3} ${props => props.max ? ((props.min ? props.value - props.min : props.value) / (props.min ? props.max - props.min : props.max)) * 100 : props.value}%);
    border-radius: ${props => props.theme.unit * 2}px;
    box-shadow: none;
  }
  ::-webkit-slider-thumb {
    /* box-shadow: 0px 0px 5px ${props => props.theme.background.z0}; */
    box-shadow: 0 0 0 1.5px ${props => props.theme.name === 'dark' ? props.theme.backgroundInverse.z6 : props.theme.background.z0}, 0 0 1px 2px rgba(0,0,0,.4);
    height: ${props => props.theme.unit * 3}px;
    width: ${props => props.theme.unit * 3}px;
    border-radius: 100%;
    background: ${props => props.theme.name === 'dark' ? props.theme.backgroundInverse.z6 : props.theme.background.z0};
    cursor: pointer;
    -webkit-appearance: none;
    transform-origin: center top;
    transform: translateY(-37%);
  }
  &.c-form-control__control--success {
    :focus,
    :focus :hover {
      box-shadow: 0 0 0 1px ${props => props.theme.palette.success} inset;
      ~ span {
        .c-form-text {
          color: ${props => props.theme.palette.success};
          fill: ${props => props.theme.palette.success};
        }
      }
    }
    ::selection {
      background: ${props => props.theme.palette.success};
    }
  }
  &.c-form-control__control--error {
    :focus,
    :focus :hover {
      box-shadow: 0 0 0 1px ${props => props.theme.palette.error} inset;
      ~ span {
        .c-form-text {
          color: ${props => props.theme.palette.error};
          fill: ${props => props.theme.palette.error};
        }
      }
    }
    ::selection {
      background: ${props => props.theme.palette.error};
    }
  }
`;

const FormControl: RefForwardingComponent<'input', FormControlProps> = forwardRef(function FormControl(props: FormControlProps, ref: any) {
  const fg = useContext(FormGroupContext);
  const theme = useContext(ThemeContext);
  const { size, left, right, id, htmlSize, isValid, isInvalid, leftReadOnly, rightReadOnly, onFocus, onBlur } = props;
  const height = size ? size === 'small' ? 24 : 40 : 32;
  const [isActive, setIsActive] = useState(false);

  const context = useMemo(() => ({
    size,
    isActive,
    isValid,
    isInvalid
  }), [size, isValid, isActive, isInvalid]);

  const handleFocus = (e: any): void => {
    setIsActive(true);
    if (onFocus) {
      onFocus(e);
    }
  }

  const handleBlur = (e: any): void => {
    setIsActive(false);
    if (onBlur) {
      onBlur(e);
    }
  }

  return (
    <FormControlContext.Provider value={context}>
      <div
        className={`c-form-control ${
          left
          ? 'c-form-control--left'
          : ''
        } ${
          right
          ? 'c-form-control--right'
          : ''
        } ${
          size
          ? `c-form-control--${size}`
          : ''
        }`}>
        <StyledComponent
          {...props}
          height={height}
          theme={theme}
          id={id || fg.controlId}
          size={htmlSize}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`c-form-control__control ${
            size
            ? `c-form-control__control--${size}`
            : ''
          } ${
            isValid
            ? 'c-form-control__control--success'
            : ''
          } ${
            isInvalid
            ? 'c-form-control__control--error'
            : ''
          }`} />
        {
          left
          ? <FormControlAddon
              type='left'
              readOnly={leftReadOnly}>
              { left }
            </FormControlAddon>
          : null
        }
        {
          right
          ? <FormControlAddon
              type='right'
              readOnly={rightReadOnly}>
              { right }
            </FormControlAddon>
          : null
        }
      </div>
    </FormControlContext.Provider>
  );
});

export default FormControl;