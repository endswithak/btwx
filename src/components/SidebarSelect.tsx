import React, { useContext, ReactElement } from 'react';
import Select, { components } from 'react-select';
import { ThemeContext } from './ThemeProvider';
import tinyColor from 'tinycolor2';

interface SidebarSelectProps {
  value: { value: string; label: string };
  placeholder: string;
  options: { value: string; label: string }[];
  onChange(selectedOption: { value: string; label: string }): void;
  type?: 'fontFamily' | 'fontWeight';
  data?: {
    fontFamily: string;
  };
  bottomLabel?: string;
  disabled?: boolean;
  isSearchable?: boolean;
}

const DropdownIndicator = (
  props: any
) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg
        viewBox='0 0 24 24'
        width='18px'
        height='18px'>
        <path d='M17.9221027,7.65690583 L11.9999918,13.935 L6.07789728,7.65690583 C5.89831309,7.46652977 5.60230705,7.44684832 5.39909894,7.61177252 L4.68491362,8.19140709 C4.45910436,8.37467444 4.43674641,8.71124816 4.63633033,8.92277357 L11.6363303,16.341597 C11.7119065,16.421695 11.8112262,16.4740318 11.9191557,16.4917589 L12.0014807,16.4984579 C12.1391366,16.4984579 12.2707002,16.4416915 12.36516,16.3415592 L19.3637053,8.92273584 C19.5632531,8.7112047 19.5408797,8.37466147 19.3150864,8.19140709 L18.6009011,7.61177252 C18.397693,7.44684832 18.1016869,7.46652977 17.9221027,7.65690583 Z' />
      </svg>
    </components.DropdownIndicator>
  );
};

const SidebarSelect = (props: SidebarSelectProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div className='c-sidebar-select-wrap'>
      <Select
        value={props.value}
        onChange={props.onChange}
        components={{ DropdownIndicator }}
        options={props.options}
        placeholder={props.placeholder}
        isDisabled={props.disabled}
        isSearchable={props.isSearchable ? props.isSearchable : false}
        styles={{
          container: (provided, state) => {
            const width = '100%';
            const cursor = 'pointer';
            const opacity = state.isDisabled ? 0.5 : 1;
            return { ...provided, width, cursor, opacity };
          },
          control: (provided, state) => {
            const background = theme.name === 'dark' ? theme.background.z3 : theme.background.z0;
            const color = theme.text.base;
            const border = 'none';
            const boxShadow = `0 0 0 1px ${state.isFocused ? theme.palette.primary : theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`;
            const minHeight = 24;
            const padding = 0;
            const cursor = 'pointer';
            return {
              ...provided, background, color, border, boxShadow, minHeight, padding, cursor,
              ':hover': {
                boxShadow: `0 0 0 1px ${state.isFocused ? theme.palette.primaryHover : theme.name === 'dark' ? theme.background.z5 : theme.background.z6}`
              },
            };
          },
          singleValue: (provided, state) => {
            const color = theme.text.base;
            const fontSize = 12;
            const lineHeight = '24px';
            const marginLeft = 0;
            return { ...provided, color, fontSize, marginLeft, lineHeight };
          },
          option: (provided, { data, isDisabled, isFocused, isSelected }) => {
            const fontFamily = props.type === 'fontFamily' ? data.value : props.type === 'fontWeight' ? props.data.fontFamily : 'inherit';
            const fontWeight = props.type === 'fontWeight' ? (() => {
              switch(data.value) {
                case 'normal':
                  return data.value;
                case 'bold':
                case 'bold italic':
                  return 'bold';
                case 'italic':
                  return 'normal';
              }
            })() : 'inherit';
            const fontStyle = props.type === 'fontWeight' ? (() => {
              switch(data.value) {
                case 'normal':
                case 'bold':
                  return data.value;
                case 'bold italic':
                case 'italic':
                  return 'italic';
              }
            })() : 'inherit';
            const fontSize = 12;
            const background = isSelected ? theme.palette.primary : 'none';
            const hoverBackground = isSelected ? theme.palette.primaryHover : theme.palette.primary;
            const color = isSelected ? theme.text.onPrimary : theme.text.base;
            const cursor = 'pointer';
            return {
              ...provided, fontFamily, fontSize, background, color, cursor, fontWeight, fontStyle,
              ':hover': {
                background: hoverBackground,
                color: theme.text.onPrimary
              },
              ':active': {
                background: theme.palette.primary
              }
            };
          },
          valueContainer: (provided, state) => {
            const paddingLeft = 4;
            const paddingRight = 4;
            const height = 24;
            const fontWeight = state.selectProps.value && props.type === 'fontWeight' ? state.selectProps.value.value : 'inherit';
            //const fontFamily = props.type === 'fontFamily' ? state.selectProps.value.value : 'inherit';
            return { ...provided, paddingLeft, paddingRight, height, fontWeight };
          },
          indicatorsContainer: (provided, state) => {
            const justifyContent = 'center';
            const width = 18;
            return { ...provided, width, justifyContent };
          },
          dropdownIndicator: (provided, state) => {
            const padding = 0;
            const paddingLeft = 4;
            const paddingRight = 4;
            const fill = state.isFocused ? theme.palette.primary : theme.text.lighter;
            return {
              ...provided, padding, paddingLeft, paddingRight, fill,
              ':hover': {
                fill: state.isFocused ? theme.palette.primaryHover : theme.text.light
              }
            };
          },
          placeholder: (provided, state) => {
            const color = theme.text.base;
            const fontSize = 12;
            const marginLeft = 0;
            return { ...provided, color, fontSize, marginLeft };
          },
          indicatorSeparator: (provided, state) => {
            const display = 'none';
            return { ...provided, display };
          },
          menu: (provided, state) => {
            const background = tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.77).toRgbString();
            const color = theme.text.base;
            const boxShadow = `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}, 0 4px 16px 0 rgba(0,0,0,0.16)`;
            const backdropFilter = 'blur(17px)';
            return { ...provided, background, color, boxShadow, backdropFilter };
          },
        }}
      />
      {
        props.bottomLabel
        ? <div
            className='c-sidebar-input__bottom-label'
            style={{
              color: theme.text.base
            }}>
            { props.bottomLabel }
          </div>
        : null
      }
    </div>
  );
}

export default SidebarSelect;