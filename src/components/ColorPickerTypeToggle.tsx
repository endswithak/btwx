/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { setCanvasColorFormat } from '../store/actions/documentSettings';
// import SidebarToggleButton from './SidebarToggleButton';
import Button from './Button';

interface ColorPickerTypeToggleProps {
  type: Btwx.ColorFormat;
}

const ColorPickerTypeToggle = (props: ColorPickerTypeToggleProps): ReactElement => {
  const { type } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    switch(type) {
      case 'rgb':
        // setType('hsl');
        dispatch(setCanvasColorFormat({colorFormat: 'hsl'}));
        break;
      case 'hsl':
        // setType('rgb');
        dispatch(setCanvasColorFormat({colorFormat: 'rgb'}));
        break;
    }
  }

  return (
    <div className='c-input'>
      <Button
        onClick={handleClick}
        active={false}
        icon='list-toggle' />
    </div>
  );
}

export default ColorPickerTypeToggle;