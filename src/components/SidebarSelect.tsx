import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import Select from 'react-select';
import { ThemeContext } from './ThemeProvider';

interface SidebarSelectProps {
  value: { value: string; label: string };
  placeholder: string;
  options: { value: string; label: string }[];
  onChange(selectedOption: { value: string; label: string }): void;
  type?: 'fontFamily';
}

// const ba = () => ({
//   ':before': {
//     content: '"( "'
//   },
//   ':after': {
//     content: '" )"'
//   }
// });

const SidebarSelect = (props: SidebarSelectProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <Select
      value={props.value}
      onChange={props.onChange}
      options={props.options}
      placeholder={props.placeholder}
      styles={{
        container: (provided, state) => {
          const width = '100%';
          const cursor = 'pointer';
          return { ...provided, width, cursor };
        },
        control: (provided, state) => {
          const background = theme.background.z4;
          const color = theme.text.base;
          const border = 'none';
          const boxShadow = state.isFocused ? `0 0 0 1px ${theme.palette.primary}` : 'none';
          const minHeight = 24;
          const padding = 0;
          const cursor = 'pointer';
          const margin = 4;
          return { ...provided, background, color, border, boxShadow, minHeight, padding, cursor, margin };
        },
        singleValue: (provided, state) => {
          const color = theme.text.base;
          const fontSize = 12;
          const lineHeight = '24px';
          const marginLeft = 0;
          return { ...provided, color, fontSize, marginLeft, lineHeight };
        },
        option: (provided, { data, isDisabled, isFocused, isSelected }) => {
          const fontFamily = props.type === 'fontFamily' ? data.value : 'inherit';
          const fontSize = 12;
          const background = isSelected ? theme.palette.primary : 'none';
          const hoverBackground = isSelected ? theme.palette.primaryHover : theme.background.z4;
          const color = isSelected ? theme.text.onPrimary : theme.text.base;
          const cursor = 'pointer';
          return {
            ...provided, fontFamily, fontSize, background, color, cursor,
            ':hover': {
              background: hoverBackground
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
          //const fontFamily = props.type === 'fontFamily' ? state.selectProps.value.value : 'inherit';
          return { ...provided, paddingLeft, paddingRight, height };
        },
        indicatorsContainer: (provided, state) => {
          const display = 'none';
          const justifyContent = 'center';
          return { ...provided, display, justifyContent };
        },
        dropdownIndicator: (provided, state) => {
          const padding = 0;
          const paddingLeft = 4;
          const paddingRight = 4;
          return { ...provided, padding, paddingLeft, paddingRight };
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
          const background = theme.background.z2;
          const color = theme.text.base;
          const boxShadow = `0 0 0 1px ${theme.background.z4} inset`;
          return { ...provided, background, color, boxShadow };
        },
      }}
    />
  );
}

export default SidebarSelect;