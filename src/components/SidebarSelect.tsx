import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import Select from 'react-select';
import { store } from '../store';

interface SidebarSelectProps {
  value: { value: string; label: string };
  placeholder: string;
  options: { value: string; label: string }[];
  onChange(selectedOption: { value: string; label: string }): void;
}

const ba = () => ({
  ':before': {
    content: '"( "'
  },
  ':after': {
    content: '" )"'
  }
});

const SidebarSelect = (props: SidebarSelectProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <Select
      value={props.value}
      onChange={props.onChange}
      options={props.options}
      placeholder={props.placeholder}
      styles={{
        container: (provided, state) => {
          const width = '100%';
          return { ...provided, width };
        },
        control: (provided, state) => {
          const background = theme.background.z1;
          const color = theme.text.base;
          const border = 'none';
          const boxShadow = 'none';
          const minHeight = 32;
          const paddingLeft = 4;
          const paddingRight = 4;
          return { ...provided, background, color, border, boxShadow, minHeight, paddingLeft, paddingRight };
        },
        singleValue: (provided, state) => {
          const color = theme.text.base;
          const fontSize = 12;
          const marginLeft = 0;
          return { ...provided, color, fontSize, marginLeft, ...ba() };
        },
        valueContainer: (provided, state) => {
          const padding = 0;
          return { ...provided, padding };
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
          return { ...provided, color, fontSize, marginLeft, ...ba() };
        },
        indicatorSeparator: (provided, state) => {
          const display = 'none';
          return { ...provided, display };
        }
      }}
    />
  );
}

export default SidebarSelect;