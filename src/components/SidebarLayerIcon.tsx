import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerIconProps {
  id: string;
  type?: Btwx.LayerType;
  isSelected?: boolean;
  isMask?: boolean;
  isOpenShape?: boolean;
  isDragGhost?: boolean;
}

const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, type, isMask, isSelected, isOpenShape, isDragGhost } = props;

  useEffect(() => {
    console.log('LAYER ICON');
  }, []);

  return (
    <div
      className='c-sidebar-layer__icon'
      id={`${id}-icon`}>
      <Icon
        name={(() => {
          switch(type) {
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
        small={type === 'Shape'}
        shapeId={type === 'Shape' ? id : null}
        style={{
          fill: isOpenShape || isMask
          ? 'none'
          : isSelected && !isDragGhost
            ? theme.text.onPrimary
            : theme.text.lighter,
          stroke: isOpenShape || isMask
          ? isSelected && !isDragGhost
            ? theme.text.onPrimary
            : theme.text.lighter
          : 'none',
          strokeWidth: 1
        }} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerIconProps): {
  type: Btwx.LayerType;
  isSelected: boolean;
  isMask: boolean;
  isOpenShape: boolean;
} => {
  const { layer } = state;
  const layerItem = layer.present.byId[ownProps.id];
  const type = layerItem.type;
  const isSelected = layerItem.selected;
  const isShape = layerItem.type === 'Shape';
  const isMask = isShape && (layerItem as Btwx.Shape).mask;
  const isOpenShape = isShape && !(layerItem as Btwx.Shape).closed;
  return { type, isMask, isSelected, isOpenShape };
};

export default connect(
  mapStateToProps,
)(SidebarLayerIcon);