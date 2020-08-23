import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerIconProps {
  layer: em.Layer;
  dragGhost: boolean;
}

const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, dragGhost } = props;

  return (
    <div
      className='c-sidebar-layer__icon'>
      <Icon
        name={(() => {
          switch(layer.type) {
            case 'Artboard':
              return 'artboard'
            case 'Group':
              return 'folder';
            case 'Shape':
              return 'shape';
            case 'Text':
              return 'text';
            case 'Image':
              return 'image';
          }
        })()}
        small={layer.type === 'Shape'}
        shapeId={layer.type === 'Shape' ? layer.id : null}
        style={{
          fill: layer.selected && !dragGhost
          ? theme.text.onPrimary
          : theme.text.lighter,
          stroke: layer.type === 'Shape' && !(layer as em.Shape).path.closed
          ? layer.selected && !dragGhost
            ? theme.text.onPrimary
            : theme.text.lighter
          : 'none',
          strokeWidth: 1
        }} />
    </div>
  );
}

export default SidebarLayerIcon;