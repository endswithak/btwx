import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import chroma from 'chroma-js';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';

interface SidebarSwatchBlendModeProps {
  blendMode: number | FileFormat.BlendMode;
}

const SidebarSwatchBlendMode = (props: SidebarSwatchBlendModeProps): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;
  const { blendMode } = props;

  return (
    <div
      className='c-sidebar-swatch__blend-mode'
      style={{
        background: theme.background.z3
      }} />
  );
}

export default SidebarSwatchBlendMode;