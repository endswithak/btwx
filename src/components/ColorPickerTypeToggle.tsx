/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { setCanvasColorFormat } from '../store/actions/documentSettings';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

interface ColorPickerTypeToggleProps {
  type: Btwx.ColorFormat;
  setType: any;
}

const ColorPickerTypeToggle = (props: ColorPickerTypeToggleProps): ReactElement => {
  const { type, setType } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    switch(type) {
      case 'rgb':
        setType('hsl');
        dispatch(setCanvasColorFormat({colorFormat: 'hsl'}));
        break;
      case 'hsl':
        setType('rgb');
        dispatch(setCanvasColorFormat({colorFormat: 'rgb'}));
        break;
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