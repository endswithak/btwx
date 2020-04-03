import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import chroma from 'chroma-js';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import SidebarInput from './SidebarInput';
import SidebarCheckbox from './SidebarCheckbox';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';

interface SidebarFillStyleProps {
  fill: FileFormat.Fill;
}

const SidebarFillStyle = (props: SidebarFillStyleProps): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;
  const { fill } = props;

  const color = `rgba(${Math.round(fill.color.red * 255)}, ${Math.round(fill.color.green * 255)}, ${Math.round(fill.color.blue * 255)}, ${fill.color.alpha})`;
  const hex = chroma(color).hex();
  const opacity = fill.color.alpha * 100;
  const blendMode = fill.contextSettings.blendMode;

  return (
    <SidebarSectionRow alignItems='center'>
      <SidebarSectionColumn width={'10%'} justifyContent={'center'}>
        <input
          type='checkbox'
          name='enabled'
          checked={fill.isEnabled} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'23%'}>
        <SidebarSwatch
          color={color}
          blendMode={blendMode} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'47%'}>
        <SidebarInput value={hex} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'20%'}>
        <SidebarInput value={opacity} label={'%'} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default SidebarFillStyle;