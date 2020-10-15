import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerIconProps {
  layer: string;
  name?: string;
  small?: boolean;
  shapeId?: string;
  isMaskOrOpenShape?: boolean;
  isSelected?: boolean;
}

const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, name, small, shapeId, isMaskOrOpenShape, isSelected } = props;

  useEffect(() => {
    console.log('LAYER ICON');
  }, []);

  return (
    <div
      className='c-sidebar-layer__icon'>
      <Icon
        name={name}
        small={small}
        shapeId={shapeId}
        style={{
          fill: isMaskOrOpenShape
          ? 'none'
          : isSelected
            ? theme.text.onPrimary
            : theme.text.lighter,
          stroke: isMaskOrOpenShape
          ? isSelected
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
  const name = (() => {
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
  })();
  const small = layerItem.type === 'Shape' || maskItem !== null;
  const shapeId = layerItem.type === 'Shape' ? ownProps.layer : maskItem ? maskItem.id : null;
  const isMaskOrOpenShape = layerItem.type === 'Shape' && (!(layerItem as em.Shape).closed || (layerItem as em.Shape).mask);
  const isSelected = layerItem.selected;
  return { name, small, shapeId, isMaskOrOpenShape, isSelected };
};

export default connect(
  mapStateToProps
)(SidebarLayerIcon);