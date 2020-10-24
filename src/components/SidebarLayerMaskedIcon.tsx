import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import chroma from 'chroma-js';
import { RootState } from '../store/reducers';
import { THEME_PRIMARY_COLOR } from '../constants';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';
import { setLayerHover, selectLayers } from '../store/actions/layer';
import { SetLayerHoverPayload, SelectLayersPayload, LayerTypes } from '../store/actionTypes/layer';

interface SidebarLayerMaskedIconProps {
  layer: string;
  isDragGhost?: boolean;
  isEnabled?: boolean;
  isSelected?: boolean;
  isEditing?: boolean;
  underlyingMask?: string;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
}

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
const underlyingMasks: string[] = [];

const SidebarLayerMaskedIcon = (props: SidebarLayerMaskedIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, isEnabled, isEditing, isSelected, underlyingMask, setLayerHover, selectLayers } = props;
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
    setLayerHover({id: underlyingMask});
  }

  const handleMouseLeave = () => {
    setHover(false);
    setLayerHover({id: layer});
  }

  const handleMouseDown = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    selectLayers({layers: [underlyingMask], newSelection: true});
  }

  useEffect(() => {
    console.log('LAYER MASKED ICON');
  }, []);

  return (
    underlyingMask
    ? <div
        className='c-sidebar-layer__icon'
        id={`${layer}-mask-icon`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}>
        <Icon
          name={isEnabled ? 'masked' : 'close-small'}
          style={{
            // fill: hover
            // ? isSelected || isEditing
            //   ? theme.text.onPrimary
            //   : theme.palette.primary
            // : theme.text.lighter,
            fill: colors[underlyingMasks.indexOf(underlyingMask)],
            stroke: hover
            ? isSelected || isEditing
              ? theme.text.onPrimary
              : theme.palette.primary
            : 'none',
            strokeWidth: hover ? 2 : 0
          }} />
      </div>
    : null
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerMaskedIconProps): {
  isEnabled: boolean;
  isSelected: boolean;
  isEditing: boolean;
  underlyingMask: string;
} => {
  const { layer, leftSidebar } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const isEnabled = layerItem.masked;
  const isSelected = layerItem.selected && !ownProps.isDragGhost;
  const isEditing = leftSidebar.editing === ownProps.layer;
  const underlyingMask = layerItem.underlyingMask;
  // if (layerItem.underlyingMask && !colors[layerItem.underlyingMask]) {
  //   colors[layerItem.underlyingMask] = chroma.random();
  // }
  if (!underlyingMasks.includes(layerItem.underlyingMask)) {
    underlyingMasks.push(layerItem.underlyingMask);
  }
  return { isEnabled, isSelected, underlyingMask, isEditing };
};

export default connect(
  mapStateToProps,
  { setLayerHover, selectLayers }
)(SidebarLayerMaskedIcon);

// import React, { useContext, ReactElement, useEffect } from 'react';
// import { connect } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { ThemeContext } from './ThemeProvider';
// import Icon from './Icon';

// interface SidebarLayerMaskedIconProps {
//   layer: string;
//   isDragGhost?: boolean;
//   isEnabled?: boolean;
//   isSelected?: boolean;
// }

// const SidebarLayerMaskedIcon = (props: SidebarLayerMaskedIconProps): ReactElement => {
//   const theme = useContext(ThemeContext);
//   const { layer, isEnabled, isSelected } = props;

//   useEffect(() => {
//     console.log('LAYER MASKED ICON');
//   }, []);

//   return (
//     isEnabled
//     ? <div
//         className='c-sidebar-layer__icon'
//         id={`${layer}-mask-icon`}
//         >
//         <Icon
//           name='masked'
//           style={{
//             fill: isSelected
//             ? theme.text.onPrimary
//             : theme.text.lighter
//           }} />
//       </div>
//     : null
//   );
// }

// const mapStateToProps = (state: RootState, ownProps: SidebarLayerMaskedIconProps): {
//   isEnabled?: boolean;
//   isSelected?: boolean;
// } => {
//   const { layer } = state;
//   const layerItem = layer.present.byId[ownProps.layer];
//   const isEnabled = layerItem.masked;
//   const isSelected = layerItem.selected && !ownProps.isDragGhost;
//   return { isEnabled, isSelected };
// };

// export default connect(
//   mapStateToProps
// )(SidebarLayerMaskedIcon);