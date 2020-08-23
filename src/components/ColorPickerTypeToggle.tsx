/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

interface ColorPickerTypeToggleProps {
  type: 'rgb' | 'hsl';
  setType: any;
}

const ColorPickerTypeToggle = (props: ColorPickerTypeToggleProps): ReactElement => {
  const { type, setType } = props;

  const handleClick = () => {
    if (type === 'rgb') {
      setType('hsl');
    } else if (type === 'hsl') {
      setType('rgb');
    }
  }

  return (
    <SidebarToggleButton
      onClick={handleClick}
      active={false}>
      <Icon
        name='list-toggle'
        small />
    </SidebarToggleButton>
  );
}

export default ColorPickerTypeToggle;