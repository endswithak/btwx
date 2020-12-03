import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerHover, selectLayers, deselectLayers } from '../store/actions/layer';
import { SetLayerHoverPayload, SelectLayersPayload, DeselectLayersPayload, LayerTypes } from '../store/actionTypes/layer';
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
  underlyingMaskSelected?: boolean;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
  deselectLayers?(payload: DeselectLayersPayload): LayerTypes;
}

const SidebarLayerMaskedIcon = (props: SidebarLayerMaskedIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, isMasked, isSelected, underlyingMask, setLayerHover, editing, underlyingMaskHover, selectLayers, deselectLayers, underlyingMaskSelected } = props;

  const handleMouseEnter = (): void => {
    setLayerHover({id: underlyingMask});
  }

  const handleMouseLeave = (): void => {
    setLayerHover({id: id});
  }

  const handleMouseDown = (e: any) => {
    e.stopPropagation();
    if (e.metaKey) {
      if (underlyingMaskSelected) {
        deselectLayers({layers: [underlyingMask]});
      } else {
        selectLayers({layers: [underlyingMask]});
      }
    } else {
      if (!underlyingMaskSelected) {
        selectLayers({layers: [underlyingMask], newSelection: true});
      }
    }
  }

  useEffect(() => {
    console.log('LAYER MASKED ICON');
  }, []);

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
  underlyingMaskSelected: boolean;
} => {
  const { leftSidebar, layer } = state;
  const layerItem = layer.present.byId[ownProps.id];
  const isMasked = layerItem.type === 'Artboard' ? null : (layerItem as Btwx.MaskableLayer).masked;
  const isSelected = layerItem.selected;
  const underlyingMask = layerItem.type === 'Artboard' ? null : (layerItem as Btwx.MaskableLayer).underlyingMask;
  const underlyingMaskItem = underlyingMask ? layer.present.byId[underlyingMask] : null;
  const editing = leftSidebar.editing === ownProps.id;
  const underlyingMaskHover = underlyingMaskItem ? underlyingMaskItem.hover : null;
  const underlyingMaskSelected = underlyingMaskItem ? underlyingMaskItem.selected : null;
  return { isMasked, isSelected, underlyingMask, editing, underlyingMaskHover, underlyingMaskSelected };
};

export default connect(
  mapStateToProps,
  { setLayerHover, selectLayers, deselectLayers }
)(SidebarLayerMaskedIcon);