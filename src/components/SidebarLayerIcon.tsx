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
  const isMask = layerItem.mask;
  const isOpenShape = layerItem.type === 'Shape' && !(layerItem as Btwx.Shape).closed;
  return { type, isMask, isSelected, isOpenShape };
};

export default connect(
  mapStateToProps,
)(SidebarLayerIcon);

// import React, { useContext, ReactElement, useEffect } from 'react';
// import { connect } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { ThemeContext } from './ThemeProvider';
// import Icon from './Icon';

// interface SidebarLayerIconProps {
//   id: string;
//   type: Btwx.LayerType;
//   selected: boolean;
//   mask: boolean;
//   closed: boolean;
//   isDragGhost?: boolean;
// }

// const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
//   const theme = useContext(ThemeContext);
//   const { id, type, mask, selected, closed, isDragGhost } = props;

//   return (
//     <div
//       className='c-sidebar-layer__icon'
//       id={`${id}-icon`}>
//       <Icon
//         name={(() => {
//           switch(type) {
//             case 'Artboard':
//               return 'artboard'
//             case 'Group':
//               return 'folder';
//             case 'Shape':
//               return 'shape';
//             case 'Text':
//               return 'text';
//             case 'Image':
//               return 'image';
//           }
//         })()}
//         small={type === 'Shape'}
//         shapeId={type === 'Shape' ? id : null}
//         style={{
//           fill: (type === 'Shape' && !closed) || mask
//           ? 'none'
//           : selected && !isDragGhost
//             ? theme.text.onPrimary
//             : theme.text.lighter,
//           stroke: (type === 'Shape' && !closed) || mask
//           ? selected && !isDragGhost
//             ? theme.text.onPrimary
//             : theme.text.lighter
//           : 'none',
//           strokeWidth: 1
//         }} />
//     </div>
//   );
// }

// export default SidebarLayerIcon;