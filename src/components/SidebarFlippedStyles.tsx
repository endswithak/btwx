import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';

interface SidebarFlippedButtonProps {
  text: string | number;
  active: boolean;
  disabled: boolean;
}

const SidebarFlippedButton = (props: SidebarFlippedButtonProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <div className='c-sidebar-styles-input-wrap'>
      <button
        className='c-sidebar-styles-input'
        style={{
          background: props.active ? theme.palette.primary : theme.background.z4,
          color: props.active ? theme.text.onPrimary : props.disabled ? theme.text.lighter : theme.text.base
        }}>
        { props.text }
      </button>
    </div>
  );
}

const SidebarFlippedStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  const isDisabled = selectedLayer === null;
  const isFlippedHorizontal = selectedLayer ? selectedLayer.isFlippedHorizontal : false;
  const isFlippedVertical = selectedLayer ? selectedLayer.isFlippedVertical : false;

  return (
    <div className='c-sidebar-frame-styles__section'>
      <SidebarFlippedButton
        text={'|'}
        active={isFlippedHorizontal}
        disabled={isDisabled} />
      <SidebarFlippedButton
        text={'—'}
        active={isFlippedVertical}
        disabled={isDisabled} />
    </div>
  );
}

export default SidebarFlippedStyles;