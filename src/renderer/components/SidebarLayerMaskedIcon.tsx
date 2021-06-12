import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerHover, selectLayers, deselectLayers } from '../store/actions/layer';
import Icon from './Icon';

interface SidebarLayerMaskedIconProps {
  id: string;
  isDragGhost?: boolean;
}

const SidebarLayerMaskedIcon = (props: SidebarLayerMaskedIconProps): ReactElement => {
  const { id, isDragGhost } = props;
  const isMasked = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Artboard' ? null : state.layer.present.byId[id] && (state.layer.present.byId[id] as Btwx.MaskableLayer).masked);
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].selected);
  const underlyingMask = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Artboard' ? null : state.layer.present.byId[id] && (state.layer.present.byId[id] as Btwx.MaskableLayer).underlyingMask);
  const underlyingMaskItem = useSelector((state: RootState) => underlyingMask ? state.layer.present.byId[underlyingMask] : null);
  const editing = useSelector((state: RootState) => state.leftSidebar.editing === id);
  const underlyingMaskHover = underlyingMaskItem ? underlyingMaskItem.hover : null;
  const underlyingMaskSelected = underlyingMaskItem ? underlyingMaskItem.selected : null;
  const dispatch = useDispatch();

  const handleMouseEnter = (): void => {
    dispatch(setLayerHover({id: underlyingMask}));
  }

  const handleMouseLeave = (): void => {
    dispatch(setLayerHover({id: id}));
  }

  const handleMouseDown = (e: any) => {
    e.stopPropagation();
    if (e.metaKey) {
      if (underlyingMaskSelected) {
        dispatch(deselectLayers({layers: [underlyingMask]}));
      } else {
        dispatch(selectLayers({layers: [underlyingMask]}));
      }
    } else {
      if (!underlyingMaskSelected) {
        dispatch(selectLayers({layers: [underlyingMask], newSelection: true}));
      }
    }
  }

  return (
    <div
      className={`c-sidebar-layer__icon ${!isMasked ? 'c-sidebar-layer__icon--empty' : null}`}
      id={`${id}-mask-icon`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}>
      {
        isMasked
        ? <Icon
            name='masked'
            variant={
              underlyingMaskHover
              ? (isSelected || editing) && !isDragGhost
                ? 'base-on-primary'
                : 'primary'
              : 'lighter'
            } />
        : null
      }
    </div>
  );
}

export default SidebarLayerMaskedIcon;