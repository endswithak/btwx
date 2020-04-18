import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import chroma from 'chroma-js';
import { store } from '../store';
import SidebarInput from './SidebarInput';
import SidebarCheckbox from './SidebarCheckbox';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import SidebarDropzone from './SidebarDropzone';
import FillNode from '../canvas/base/fillNode';
import StyleNode from '../canvas/base/styleNode';

interface SidebarFillStyleProps {
  layer: FillNode;
  index: number;
  dragLayer: StyleNode;
  dragEnterLayer: StyleNode;
  dropzone: em.Dropzone;
  depth: number;
}

const SidebarFillStyle = (props: SidebarFillStyleProps): ReactElement => {
  const globalState = useContext(store);
  const { selection, dispatch } = globalState;
  const { layer, dragLayer, dragEnterLayer, dropzone } = props;

  const color = layer.color;
  const opacity = layer.opacity * 100;
  const blendMode = layer.blendMode;

  const handleCheckChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      dispatch({
        type: 'enable-style',
        layer: layer
      });
    } else {
      dispatch({
        type: 'disable-style',
        layer: layer
      });
    }
  };

  const handleOpacityChange = (value: number): void => {
    dispatch({
      type: 'change-fill-opacity',
      layer: layer,
      opacity: value / 100
    });
  };

  return (
    <div
      id={layer.id}
      draggable
      className='c-sidebar-layer'>
      {
        dragLayer
        ? <SidebarDropzone
            layer={layer}
            depth={0}
            dragLayer={dragLayer}
            dragEnterLayer={dragEnterLayer}
            dropzone={dropzone} />
        : null
      }
      <SidebarSectionRow alignItems='center'>
        <SidebarSectionColumn width={'10%'} justifyContent={'center'}>
          <SidebarCheckbox
            id={`fill-${layer.id}`}
            onChange={handleCheckChange}
            checked={layer.enabled} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'23%'}>
          <SidebarSwatch
            color={color}
            blendMode={blendMode} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'47%'}>
          <SidebarInput
            value={color} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'20%'}>
          <SidebarInput
            value={opacity}
            onSubmit={handleOpacityChange}
            label={'%'} />
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </div>
  );
}

export default SidebarFillStyle;