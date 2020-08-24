import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerIconProps {
  layer: em.Layer;
  dragGhost: boolean;
  maskItem?: em.Shape;
}

const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, dragGhost, maskItem } = props;

  return (
    <div
      className='c-sidebar-layer__icon'>
      <Icon
        name={(() => {
          switch(layer.type) {
            case 'Artboard':
              return 'artboard'
            case 'Group':
              return maskItem ? 'shape' : 'folder';
            case 'Shape':
              return 'shape';
            case 'Text':
              return 'text';
            case 'Image':
              return 'image';
          }
        })()}
        small={layer.type === 'Shape' || maskItem !== null}
        shapeId={layer.type === 'Shape' ? layer.id : maskItem ? maskItem.id : null}
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

const mapStateToProps = (state: RootState, ownProps: SidebarLayerIconProps) => {
  const { layer } = state;
  const layerItem = ownProps.layer;
  const mask = layerItem.type === 'Group' && (layerItem as em.Group).clipped ? (() => {
    return (layerItem as em.Group).children.find((id) => layer.present.byId[id].mask);
  })() : null;
  const maskItem = mask ? layer.present.byId[mask] : null;
  return { maskItem };
};

export default connect(
  mapStateToProps
)(SidebarLayerIcon);