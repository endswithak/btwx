/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { setCanvasColorFormat } from '../store/actions/documentSettings';
import { SetCanvasColorFormatPayload, DocumentSettingsTypes } from '../store/actionTypes/documentSettings';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

interface ColorPickerTypeToggleProps {
  type: Btwx.ColorFormat;
  setType: any;
  setCanvasColorFormat?(payload: SetCanvasColorFormatPayload): DocumentSettingsTypes;
}

const ColorPickerTypeToggle = (props: ColorPickerTypeToggleProps): ReactElement => {
  const { type, setType, setCanvasColorFormat } = props;

  const handleClick = () => {
    switch(type) {
      case 'rgb':
        setType('hsl');
        setCanvasColorFormat({colorFormat: 'hsl'});
        break;
      case 'hsl':
        setType('rgb');
        setCanvasColorFormat({colorFormat: 'rgb'});
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

export default connect(
  null,
  { setCanvasColorFormat }
)(ColorPickerTypeToggle);