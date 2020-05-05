import React, { useContext, ReactElement, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import LayerNode from '../canvas/base/layerNode';

interface SidebarLayerFolderProps {
  layer: em.Layer;
}

const SidebarLayerFolder = (props: SidebarLayerFolderProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer } = props;

  return (
    layer.type === 'Group' || layer.type === 'Artboard'
    ? <div
        className='c-sidebar-layer__folder'>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            strokeWidth: 1,
            stroke: layer.selected
            ? theme.text.onPrimary
            : theme.text.lighter,
            fill: theme.text.lightest
          }}>
          <path d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z' />
        </svg>
      </div>
    : null
  );
}

export default SidebarLayerFolder;