import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import SidebarSwatchBlendMode from './SidebarSwatchBlendMode';

interface SidebarSwatchProps {
  color?: string;
  blendMode: number | FileFormat.BlendMode;
}

const SidebarSwatch = (props: SidebarSwatchProps): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;
  const { color, blendMode } = props;

  return (
    <div className='c-sidebar-swatch'>
      <div className='c-sidebar-swatch__inner'>
        <div
          className='c-sidebar-swatch__color'
          style={{background: color}} />
        <SidebarSwatchBlendMode
          blendMode={blendMode} />
      </div>
    </div>
  );
}

export default SidebarSwatch;