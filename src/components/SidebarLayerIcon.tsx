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
        return 'M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z';
      case 'Group':
        return 'M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z';
      case 'Shape':
        return (layer as em.Shape).pathData;
      case 'Text':
        return 'M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z';
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
          fill: theme.text.lighter
        }}>
        <path d={pathData()} />
      </svg>
    </div>
  );
}

export default SidebarLayerIcon;