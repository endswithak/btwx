import React, { useContext, ReactElement, useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { showLayerChildren, hideLayerChildren } from '../store/actions/layer';
import { LayerTypes, ShowLayerChildrenPayload, HideLayerChildrenPayload } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerChevronProps {
  id: string;
  isOpen: boolean;
  isDragGhost?: boolean;
  isSelected?: boolean;
  canOpen?: boolean;
  setOpen?(isOpen: boolean): void;
  showLayerChildren?(payload: ShowLayerChildrenPayload): LayerTypes;
  hideLayerChildren?(payload: HideLayerChildrenPayload): LayerTypes;
}

const SidebarLayerChevron = (props: SidebarLayerChevronProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, isSelected, canOpen, isDragGhost, isOpen, setOpen, showLayerChildren, hideLayerChildren } = props;
  const [hover, setHover] = useState(false);

  const handleMouseDown = (e: any) => {
    e.stopPropagation();
    setOpen(!isOpen);
    if (isOpen) {
      hideLayerChildren({id});
    } else {
      showLayerChildren({id});
    }
  }

  useEffect(() => {
    console.log('LAYER CHEVRON');
  }, []);

  return (
    <div
      className='c-sidebar-layer__icon c-sidebar-layer__icon--chevron'
      id={`${id}-open-icon`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={canOpen ? handleMouseDown : null}
      onMouseUp={() => setHover(true)}
      style={{
        pointerEvents: canOpen ? 'auto' : 'none'
      }}>
      {
        canOpen
        ? <Icon
            name={isOpen ? 'thicc-chevron-down' : 'thicc-chevron-right'}
            small
            style={{
              fill: isSelected
              ? theme.text.onPrimary
              : hover
                ? theme.text.base
                : theme.text.lighter
            }} />
        : null
      }
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerChevronProps): {
  isSelected: boolean;
  canOpen: boolean;
} => {
  const { layer } = state;
  const layerItem = layer.present.byId[ownProps.id];
  const canOpen = layerItem.type === 'Group' || layerItem.type === 'Artboard';
  const isSelected = layerItem.selected;
  return { canOpen, isSelected };
};
export default connect(
  mapStateToProps,
  {showLayerChildren, hideLayerChildren}
)(SidebarLayerChevron);

// import React, { useContext, ReactElement } from 'react';
// import { ThemeContext } from './ThemeProvider';
// import Icon from './Icon';

// interface SidebarLayerChevronProps {
//   id: string;
//   type: Btwx.LayerType;
//   selected: boolean;
//   isOpen: boolean;
//   isDragGhost?: boolean;
// }

// const SidebarLayerChevron = (props: SidebarLayerChevronProps): ReactElement => {
//   const theme = useContext(ThemeContext);
//   const { id, type, selected, isDragGhost, isOpen } = props;

//   return (
//     <div
//       className='c-sidebar-layer__icon c-sidebar-layer__icon--chevron'
//       id={`${id}-open-icon`}
//       style={{
//         pointerEvents: (type === 'Group' || type === 'Artboard' || type === 'Page') ? 'auto' : 'none'
//       }}>
//       {
//         (type === 'Group' || type === 'Artboard' || type === 'Page')
//         ? <Icon
//             name={isOpen ? 'thicc-chevron-down' : 'thicc-chevron-right'}
//             small
//             style={{
//               fill: selected
//               ? theme.text.onPrimary
//               : theme.text.lighter
//             }} />
//         : null
//       }
//     </div>
//   );
// }

// export default SidebarLayerChevron;