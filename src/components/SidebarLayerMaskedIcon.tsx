import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerHover } from '../store/actions/layer';
import { SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerMaskedIconProps {
  id: string;
  isDragGhost?: boolean;
  underlyingMask?: string;
  isMasked?: boolean;
  isSelected?: boolean;
  editing?: boolean;
  underlyingMaskHover?: boolean;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
}

const SidebarLayerMaskedIcon = (props: SidebarLayerMaskedIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, isMasked, isSelected, underlyingMask, setLayerHover, editing, underlyingMaskHover } = props;

  const handleMouseEnter = (): void => {
    setLayerHover({id: underlyingMask});
  }

  const handleMouseLeave = (): void => {
    setLayerHover({id: id});
  }

  useEffect(() => {
    console.log('LAYER MASKED ICON');
  }, []);

  return (
    <div
      className={`c-sidebar-layer__icon ${!underlyingMask ? 'c-sidebar-layer__icon--empty' : null}`}
      id={`${id}-mask-icon`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {
        underlyingMask
        ? <Icon
            name={isMasked ? 'masked' : 'close-small'}
            style={{
              fill: underlyingMaskHover
              ? isSelected || editing
                ? theme.text.onPrimary
                : theme.palette.primary
              : theme.text.lighter
            }} />
        : null
      }
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerMaskedIconProps): {
  isMasked: boolean;
  isSelected: boolean;
  underlyingMask: string;
  editing: boolean;
  underlyingMaskHover: boolean;
} => {
  const { leftSidebar, layer } = state;
  const layerItem = layer.present.byId[ownProps.id];
  const isMasked = layerItem.masked;
  const isSelected = layerItem.selected;
  const underlyingMask = layerItem.underlyingMask;
  const editing = leftSidebar.editing === ownProps.id;
  const underlyingMaskHover = layer.present.hover === underlyingMask;
  return { isMasked, isSelected, underlyingMask, editing, underlyingMaskHover };
};

export default connect(
  mapStateToProps,
  { setLayerHover }
)(SidebarLayerMaskedIcon);

// import React, { useContext, ReactElement } from 'react';
// import { connect } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { setLayerHover } from '../store/actions/layer';
// import { SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';
// import { ThemeContext } from './ThemeProvider';
// import Icon from './Icon';

// interface SidebarLayerMaskedIconProps {
//   id: string;
//   masked: boolean;
//   underlyingMask: string;
//   selected: boolean;
//   isDragGhost?: boolean;
//   editing?: boolean;
//   underlyingMaskHover?: boolean;
//   setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
// }

// const SidebarLayerMaskedIcon = (props: SidebarLayerMaskedIconProps): ReactElement => {
//   const theme = useContext(ThemeContext);
//   const { id, masked, selected, underlyingMask, setLayerHover, editing, underlyingMaskHover } = props;

//   const handleMouseEnter = (): void => {
//     setLayerHover({id: underlyingMask});
//   }

//   const handleMouseLeave = (): void => {
//     setLayerHover({id: id});
//   }

//   return (
//     <div
//       className={`c-sidebar-layer__icon ${!underlyingMask ? 'c-sidebar-layer__icon--empty' : null}`}
//       id={`${id}-mask-icon`}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}>
//       {
//         underlyingMask
//         ? <Icon
//             name={masked ? 'masked' : 'close-small'}
//             style={{
//               fill: underlyingMaskHover
//               ? selected || editing
//                 ? theme.text.onPrimary
//                 : theme.palette.primary
//               : theme.text.lighter
//             }} />
//         : null
//       }
//     </div>
//   );
// }

// const mapStateToProps = (state: RootState, ownProps: SidebarLayerMaskedIconProps): {
//   editing: boolean;
//   underlyingMaskHover: boolean;
// } => {
//   const { leftSidebar, layer } = state;
//   const editing = leftSidebar.editing === ownProps.id;
//   const underlyingMaskHover = layer.present.hover === ownProps.underlyingMask;
//   return { editing, underlyingMaskHover };
// };

// export default connect(
//   mapStateToProps,
//   { setLayerHover }
// )(SidebarLayerMaskedIcon);