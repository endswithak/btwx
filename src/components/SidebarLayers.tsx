import React, { useContext, ReactElement } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import SidebarLayer from './SidebarLayer';

interface SidebarLayersProps {
  layers: FileFormat.AnyLayer[];
  depth: number;
  path: string;
}

const SidebarLayers = (props: SidebarLayersProps): ReactElement => {
  const globalState = useContext(store);
  return (
    <div
      className='c-layers-sidebar__layers'>
      {
        props.layers.map((layer: FileFormat.AnyLayer, index: number) => (
          <SidebarLayer
            key={index}
            layer={layer}
            depth={props.depth}
            path={props.path} />
        ))
      }
    </div>
  )
}

export default SidebarLayers;