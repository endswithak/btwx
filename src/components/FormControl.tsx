/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, forwardRef, ReactElement } from 'react';
import styled from 'styled-components';
import { RefForwardingComponent } from '../utils';
import { ThemeContext } from './ThemeProvider';
import FormGroupContext from './FormGroupContext';
import FormControlAddon from './FormControlAddon';
import Icon from './Icon';

type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export interface FormControlProps {
  as?: 'input' | 'select';
  size?: Btwx.SizeVariant;
  isValid?: boolean;
  isInvalid?: boolean;
  isActive?: boolean;
  left?: ReactElement;
  right?: ReactElement;
  leftReadOnly?: boolean;
  rightReadOnly?: boolean;
  id?: string;
  type?: string;
  value?: string | string[] | number;
  sliderType?: 'hue' | 'alpha';
  sliderProps?: any;
  colorGradient?: string;
  multiColor?: boolean;
  disabled?: boolean;
  placeholder?: string;
  htmlSize?: number;
  search?: boolean;
  onChange?: React.ChangeEventHandler<FormControlElement>;
  onFocus?: React.FocusEventHandler<FormControlElement>;
  onBlur?: React.FocusEventHandler<FormControlElement>;
}

const DefaultSlider = styled.input`
  ::-webkit-slider-runnable-track {
    background: linear-gradient(to right, ${props => props.theme.palette.primary} ${props => props.max ? ((props.min ? props.value - props.min : props.value) / (props.min ? props.max - props.min : props.max)) * 100 : props.value}%, ${props => props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z3} ${props => props.max ? ((props.min ? props.value - props.min : props.value) / (props.min ? props.max - props.min : props.max)) * 100 : props.value}%);
  }
`;

interface AlphaSliderProps {
  hue: number | 'mutli';
  saturation: number | 'mutli';
  lightness: number | 'mutli';
}

const AlphaSlider = styled.input<AlphaSliderProps>`
  ::-webkit-slider-runnable-track {
    background: linear-gradient(to right, hsla(${props => props.hue !== 'multi' ? props.hue : 0}, ${props => props.saturation !== 'multi' ? props.saturation * 100 : 0}%, ${props => props.lightness !== 'multi' ? props.lightness * 100 : 0}%, 0) 0%, hsla(${props => props.hue !== 'multi' ? props.hue : 0},${props => props.saturation !== 'multi' ? props.saturation * 100 : 0}%, ${props => props.lightness !== 'multi' ? props.lightness * 100 : 0}%, 1) 100%);
  }
`;

const HueSlider = styled.input`
  ::-webkit-slider-runnable-track {
    background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
  }
`;

const FormControl: RefForwardingComponent<'input', FormControlProps> = forwardRef(function FormControl({
  as: Tag = 'input',
  id,
  htmlSize,
  size,
  isValid,
  isInvalid,
  isActive,
  sliderType,
  sliderProps,
  left,
  right,
  leftReadOnly,
  rightReadOnly,
  colorGradient,
  multiColor,
  style,
  search,
  ...rest
}: FormControlProps, ref: any) {
  const fg = useContext(FormGroupContext);
  const theme = useContext(ThemeContext);
  const controlSize = size ? size === 'small' ? 24 : 40 : 32;
  Tag = (() => {
    if (rest.type && rest.type === 'range') {
      switch(sliderType) {
        case 'hue':
          return HueSlider;
        case 'alpha':
          return AlphaSlider;
        default:
          return DefaultSlider;
      }
    } else {
      return Tag;
    }
  })();

  return (
    <div className='c-form-control-wrap'>
      <Tag
        {...rest}
        {...(rest.type && rest.type === 'range' ? { theme, ...sliderProps } : {})}
        id={id || fg.controlId}
        size={htmlSize}
        ref={ref}
        className={`c-form-control${
          left
          ? `${' '}c-form-control--left`
          : ''
        }${
          search
          ? `${' '}c-form-control--search`
          : ''
        }${
          right
          ? `${' '}c-form-control--right`
          : ''
        }${
          size
          ? `${' '}c-form-control--${size}`
          : ''
        }${
          isValid
          ? `${' '}c-form-control--valid`
          : ''
        }${
          isInvalid
          ? `${' '}c-form-control--invalid`
          : ''
        }${
          isActive
          ? `${' '}c-form-control--active`
          : ''
        }${
          sliderProps && sliderProps.thicc
          ? `${' '}c-form-control--thicc-slider`
          : ''
        }${
          multiColor
          ? `${' '}c-form-control--multi-color`
          : ''
        }`}
        style={{
          ...style,
          ...(htmlSize ? { height: htmlSize * controlSize } : {})
        }} />
      {
        left
        ? <FormControlAddon
            type='left'
            readOnly={leftReadOnly}
            size={size}>
            { left }
          </FormControlAddon>
        : null
      }
      {
        right
        ? <FormControlAddon
            type='right'
            readOnly={rightReadOnly}
            size={size}>
            { right }
          </FormControlAddon>
        : null
      }
      {
        colorGradient
        ? <div className='c-form-control__color-overlay'>
            <div style={{background: colorGradient}} />
          </div>
        : null
      }
      {
        multiColor
        ? <div className='c-form-control__color-overlay'>
            <Icon name='more' />
          </div>
        : null
      }
    </div>
  );
});

export default FormControl;