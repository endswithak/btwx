import React, { useContext, ReactElement } from 'react';
import Select, { components } from 'react-select';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarSelectProps {
  value: { value: string | number; label: string | number };
  placeholder: string;
  options: { value: string | number; label: string | number }[];
  onChange(selectedOption: { value: string | number; label: string | number }): void;
  onFocus?(): void;
  onBlur?(): void;
  type?: 'fontFamily' | 'fontWeight';
  data?: {
    fontFamily: string;
  };
  bottomLabel?: string;
  disabled?: boolean;
  isSearchable?: boolean;
  truncateOptions?: boolean;
  menuIsOpen?: boolean;
  fontFamilySelector?: boolean;
  isClearable?: boolean;
  backspaceRemovesValue?: boolean;
}

const DropdownIndicator = (
  props: any
): any => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon
        name='thicc-chevron-down'
        size='small' />
    </components.DropdownIndicator>
  );
};

const SearchDropdownIndicator = (
  props: any
): any => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon
        name='search'
        size='small' />
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
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        components={{ DropdownIndicator, IndicatorSeparator: null }}
        options={props.options}
        placeholder={props.placeholder}
        isDisabled={props.disabled}
        menuIsOpen={props.menuIsOpen}
        isClearable={props.isClearable}
        backspaceRemovesValue={props.backspaceRemovesValue}
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
            const boxShadow = `0 0 0 1px ${state.isFocused ? theme.palette.primary : theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`;
            const minHeight = 24;
            const padding = 0;
            const cursor = 'pointer';
            const transition = 'none';
            return {
              ...provided, background, color, border, boxShadow, minHeight, padding, cursor, transition,
              ':hover': {
                boxShadow: `0 0 0 1px ${state.isFocused ? theme.palette.primary : theme.name === 'dark' ? theme.background.z5 : theme.background.z6} inset`
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
          input: (provided, state) => {
            const color = theme.text.base;
            const fontSize = 12;
            const lineHeight = '24px';
            const marginLeft = 0;
            return { ...provided, color, fontSize, marginLeft, lineHeight };
          },
          option: (provided, { data, isDisabled, isFocused, isSelected }) => {
            const fontFamily = props.type === 'fontFamily' ? data.value : props.type === 'fontWeight' ? props.data.fontFamily : 'inherit';
            const fontWeight = props.type === 'fontWeight' ? data.value : 'inherit';
            const fontSize = 12;
            const background = isFocused ? theme.palette.primary : isSelected ? tinyColor(theme.text.lightest).setAlpha(0.15).toRgbString() : 'none';
            const color = isFocused ? theme.text.onPalette.primary : theme.text.base;
            const cursor = 'pointer';
            const borderRadius = theme.unit;
            const paddingLeft = 4;
            const paddingRight = 4;
            const overflow = props.truncateOptions ? 'hidden' : 'initial';
            const whiteSpace = props.truncateOptions ?'nowrap' : 'initial';
            const textOverflow = props.truncateOptions ? 'ellipsis' : 'initial';
            return {
              ...provided, overflow, whiteSpace, textOverflow, paddingLeft, paddingRight, fontFamily, fontSize, background, color, cursor, fontWeight, borderRadius,
              ':active': {
                background: theme.palette.primary
              }
            };
          },
          valueContainer: (provided, state) => {
            const paddingLeft = 4;
            const paddingRight = 4;
            const height = 24;
            // const fontWeight = state.selectProps.value && props.type === 'fontWeight' ? state.selectProps.value.value : 'inherit';
            //const fontFamily = props.type === 'fontFamily' ? state.selectProps.value.value : 'inherit';
            return { ...provided, paddingLeft, paddingRight, height };
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
                fill: state.isFocused ? theme.palette.primary : theme.text.light
              }
            };
          },
          placeholder: (provided, state) => {
            const color = theme.text.base;
            const fontSize = 12;
            const marginLeft = 0;
            return { ...provided, color, fontSize, marginLeft };
          },
          menu: (provided, state) => {
            const background = tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.77).toRgbString();
            const color = theme.text.base;
            const boxShadow = `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}, 0 4px 16px 0 rgba(0,0,0,0.16)`;
            const backdropFilter = 'blur(17px)';
            const padding = `0 ${theme.unit}px`;
            return { ...provided, background, color, boxShadow, backdropFilter, padding };
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