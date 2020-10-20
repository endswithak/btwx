import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';
import { capitalize } from '../utils';

interface SidebarLayerIconProps {
  layer: string;
  isDragGhost?: boolean;
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
      className='c-sidebar-layer__icon'
      id={`${layer}-icon`}>
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
  const name = (() => {
    switch(layerItem.type) {
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
  })();
  const isShape = layerItem.type === 'Shape';
  const isMask = isShape && (layerItem as em.Shape).mask;
  const isOpen = isShape && !(layerItem as em.Shape).closed;
  const small = isShape;
  const shapeId = isShape ? ownProps.layer : null;
  const isMaskOrOpenShape = isOpen || isMask;
  const isSelected = layerItem.selected && !ownProps.isDragGhost;
  return { name, small, shapeId, isMaskOrOpenShape, isSelected };
};

export default connect(
  mapStateToProps
)(SidebarLayerIcon);