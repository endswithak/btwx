import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SetEditingPayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { setEditing } from '../store/actions/leftSidebar';
import { setLayerHover, selectLayer, deselectLayer } from '../store/actions/layer';
import { SelectLayerPayload, DeselectLayerPayload, SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';
import { openContextMenu } from '../store/actions/contextMenu';
import { OpenContextMenuPayload, ContextMenuTypes } from '../store/actionTypes/contextMenu';
import { ThemeContext } from './ThemeProvider';
import SidebarLayerTitle from './SidebarLayerTitle';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerIcon from './SidebarLayerIcon';
import SidebarLayerBackground from './SidebarLayerBackground';
import SidebarLayerMaskedIcon from './SidebarLayerMaskedIcon';

interface SidebarLayerItemProps {
  layer: string;
  depth?: number;
  isSelected?: boolean;
  editing?: boolean;
  dragGhost?: boolean;
  setEditing?(payload: SetEditingPayload): LeftSidebarTypes;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
  deselectLayer?(payload: DeselectLayerPayload): LayerTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
}

const SidebarLayerItem = (props: SidebarLayerItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, dragGhost, isSelected, depth, editing, setLayerHover, openContextMenu, selectLayer, deselectLayer, setEditing } = props;

  const handleMouseDown = (e: any): void => {
    if (!editing) {
      if (e.metaKey) {
        if (isSelected) {
          deselectLayer({id: layer});
        } else {
          selectLayer({id: layer});
        }
      } else {
        if (!isSelected) {
          selectLayer({id: layer, newSelection: true});
        }
      }
    }
  }

  const handleMouseEnter = (): void => {
    setLayerHover({id: layer});
  }

  const handleMouseLeave = (): void => {
    setLayerHover({id: null});
  }

  const handleContextMenu = (e: any) => {
    if (!editing) {
      openContextMenu({
        type: 'LayerEdit',
        id: layer,
        x: e.clientX,
        y: e.clientY,
        paperX: e.clientX,
        paperY: e.clientY,
        data: {
          origin: 'sidebar'
        }
      });
    }
  }

  const handleDoubleClick = (e: any): void => {
    setEditing({editing: layer});
  }

  // useEffect(() => {
  //   console.log('LAYER ITEM');
  // }, []);

  return (
    <div
      className='c-layers-sidebar__layer-item'
      style={{
        paddingLeft: depth * (theme.unit * 1.44)
      }}
      onMouseDown={dragGhost ? null : handleMouseDown}
      onMouseEnter={dragGhost ? null : handleMouseEnter}
      onMouseLeave={dragGhost ? null : handleMouseLeave}
      onContextMenu={dragGhost ? null : handleContextMenu}
      onDoubleClick={dragGhost ? null : handleDoubleClick}>
      <SidebarLayerBackground
        layer={layer}
        dragGhost={dragGhost} />
      <SidebarLayerChevron
        layer={layer}
        dragGhost={dragGhost} />
      <SidebarLayerMaskedIcon
        layer={layer}
        dragGhost={dragGhost} />
      <SidebarLayerIcon
        layer={layer}
        dragGhost={dragGhost} />
      <SidebarLayerTitle
        layer={layer}
        dragGhost={dragGhost} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerItemProps) => {
  const { layer, leftSidebar } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const isSelected = layerItem.selected;
  const editing = leftSidebar.editing === ownProps.layer;
  const depth = layerItem.scope.length - 1;
  return { isSelected, editing, depth };
};

export default connect(
  mapStateToProps,
  { setLayerHover, openContextMenu, selectLayer, deselectLayer, setEditing }
)(SidebarLayerItem);