import React, { useContext, ReactElement, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerIconProps {
  layer: em.Layer;
}

const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer } = props;

  const pathData = () => {
    switch(layer.type) {
      case 'Artboard':
        return 'M14,3 L14,4 L21,4 L21,15 L22,15 L22,16 L18,16 L18,21 L17,21 L17,18 L7,18 L7,21 L6,21 L6,16 L2,16 L2,15 L3,15 L3,4 L10,4 L10,3 L14,3 Z M17,16 L7,16 L7,17 L17,17 L17,16 Z';
      case 'Group':
        return 'M20.99,20 L3.01,20 C3.00447715,20 3,19.9955228 3,19.99 L3,4.01 C3,4.00447715 3.00447715,4 3.01,4 L11.99,4 C11.9955228,4 12,4.00447715 12,4.01 L12,5.99 C12,5.99552285 12.0044772,6 12.01,6 L20.99,6 C20.9955228,6 21,6.00447715 21,6.01 L21,19.99 C21,19.9955228 20.9955228,20 20.99,20 Z';
      case 'Shape':
        return (layer as em.Shape).pathData;
      case 'Text':
        return 'M12.84,18.999 L12.84,6.56 L12.84,6.56 L16.92,6.56 L16.92,5 L7.08,5 L7.08,6.56 L11.16,6.56 L11.16,19 L12.839,19 C12.8395523,19 12.84,18.9995523 12.84,18.999 Z';
    }
  }

  return (
    <div
      className='c-sidebar-layer__icon'>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        style={{
          // strokeWidth: 1,
          // stroke: layer.selected
          // ? theme.text.onPrimary
          // : theme.text.lighter,
          fill: theme.text.lighter,
          transform: layer.type === 'Shape' ? `scale(0.75)` : 'none'
        }}>
        <path d={pathData()} />
      </svg>
    </div>
  );
}

export default SidebarLayerIcon;