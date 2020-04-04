import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';

interface SidebarFlippedButtonProps {
  text: string | number;
  active: boolean;
  disabled?: boolean;
}

const SidebarFlippedButton = (props: SidebarFlippedButtonProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <div className='c-sidebar-input'>
      <button
        className='c-sidebar-input__field'
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
  const { selectedLayer, theme, dispatch, selectedPaperLayer } = globalState;

  // const isDisabled = selectedLayer === null;
  // const isFlippedHorizontal = selectedLayer ? selectedLayer.isFlippedHorizontal : false;
  // const isFlippedVertical = selectedLayer ? selectedLayer.isFlippedVertical : false;
  const isFlippedHorizontal = selectedLayer.scaling.y === -1;
  const isFlippedVertical = selectedLayer.scaling.x === -1;

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn>
        <SidebarFlippedButton
          text={'|'}
          active={isFlippedHorizontal} />
      </SidebarSectionColumn>
      <SidebarSectionColumn>
        <SidebarFlippedButton
          text={'—'}
          active={isFlippedVertical} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default SidebarFlippedStyles;