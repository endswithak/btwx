import React, { useContext, ReactElement } from 'react';
import { paperMain } from '../canvas';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerIconProps {
  layer: em.Layer;
  dragGhost: boolean;
}

const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, dragGhost } = props;

  const pathData = () => {
    switch(layer.type) {
      case 'Artboard':
        return Icon('artboard').fill;
      case 'Group':
        return Icon('folder').fill;
      case 'Shape': {
        const layerIcon = new paperMain.Path({
          pathData: (layer as em.Shape).path.data,
          insert: false
        });
        layerIcon.fitBounds(new paperMain.Rectangle({
          point: new paperMain.Point(0,0),
          size: new paperMain.Size(24,24)
        }));
        return layerIcon.pathData;
      }
      case 'Text':
        return Icon('text').fill;
      case 'Image':
        return Icon('image').fill;
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
          fill: layer.selected && !dragGhost
          ? theme.text.onPrimary
          : theme.text.lighter,
          transform: layer.type === 'Shape' ? `scale(0.75)` : 'none',
          stroke: layer.type === 'Shape' && !(layer as em.Shape).path.closed
          ? layer.selected && !dragGhost
            ? theme.text.onPrimary
            : theme.text.lighter
          : 'none',
          strokeWidth: 1
        }}>
        <path d={pathData()} />
      </svg>
    </div>
  );
}

export default SidebarLayerIcon;