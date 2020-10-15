import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerIconProps {
  layer: string;
  dragGhost: boolean;
  layerItem?: em.Layer;
  maskItem?: em.Shape;
}

const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layerItem, layer, dragGhost, maskItem } = props;

  return (
    <div
      className='c-sidebar-layer__icon'>
      <Icon
        name={(() => {
          switch(layerItem.type) {
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
        small={layerItem.type === 'Shape' || maskItem !== null}
        shapeId={layerItem.type === 'Shape' ? layer : maskItem ? maskItem.id : null}
        style={{
          fill: layerItem.type === 'Shape' && (!(layerItem as em.Shape).closed || (layerItem as em.Shape).mask)
          ? 'none'
          : layerItem.selected && !dragGhost
            ? theme.text.onPrimary
            : theme.text.lighter,
          stroke: layerItem.type === 'Shape' && (!(layerItem as em.Shape).closed || (layerItem as em.Shape).mask)
          ? layerItem.selected && !dragGhost
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
  const layerItem = layer.present.byId[ownProps.layer];
  const mask = layerItem.type === 'Group' && (layerItem as em.Group).clipped ? (() => {
    return (layerItem as em.Group).children.find((id) => layer.present.byId[id].mask);
  })() : null;
  const maskItem = mask ? layer.present.byId[mask] : null;
  return { layerItem, maskItem };
};

export default connect(
  mapStateToProps
)(SidebarLayerIcon);