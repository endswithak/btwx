import React, { useContext, ReactElement, useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SetEditingPayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { setEditing } from '../store/actions/leftSidebar';
import { setLayerHover, selectLayers, deselectLayers } from '../store/actions/layer';
import { SelectLayersPayload, DeselectLayersPayload, SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';
import { openContextMenu } from '../store/actions/contextMenu';
import { OpenContextMenuPayload, ContextMenuTypes } from '../store/actionTypes/contextMenu';
import { ThemeContext } from './ThemeProvider';
import SidebarLayerTitle from './SidebarLayerTitle';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerIcon from './SidebarLayerIcon';
import SidebarLayerBackground from './SidebarLayerBackground';
import SidebarLayerMaskedIcon from './SidebarLayerMaskedIcon';

interface SidebarLayerItemProps {
  id: string;
  isOpen: boolean;
  name: string;
  type: Btwx.LayerType;
  mask: boolean;
  underlyingMask: string;
  ignoreUnderlyingMask: boolean;
  masked: boolean;
  selected: boolean;
  hover: boolean;
  pathData: string;
  closed: boolean;
  setOpen: any;
  nestingLevel: number;
  isDragGhost?: boolean;
  editing?: boolean;
  setEditing?(payload: SetEditingPayload): LeftSidebarTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
  deselectLayers?(payload: DeselectLayersPayload): LayerTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
}

const SidebarLayerItem = (props: SidebarLayerItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, name, type, mask, underlyingMask, ignoreUnderlyingMask, masked, selected, hover, pathData, closed, isOpen, setOpen, nestingLevel, setLayerHover, openContextMenu, selectLayers, deselectLayers, setEditing, isDragGhost, editing } = props;

  const handleMouseDown = (e: any): void => {
    if (!editing) {
      if (e.metaKey) {
        if (selected) {
          deselectLayers({layers: [id]});
        } else {
          selectLayers({layers: [id]});
        }
      } else {
        if (!selected) {
          selectLayers({layers: [id], newSelection: true});
        }
      }
    }
  }

  const handleMouseEnter = (): void => {
    setLayerHover({id: id});
  }

  const handleMouseLeave = (): void => {
    setLayerHover({id: null});
  }

  const handleContextMenu = (e: any) => {
    if (!editing) {
      openContextMenu({
        type: 'LayerEdit',
        id: id,
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
    const layerExpand = document.getElementById(`${id}-expand`);
    if (e.target !== layerExpand && !layerExpand.contains(e.target)) {
      setEditing({editing: id, edit: name});
    }
  }

  return (
    <div
      className='c-layers-sidebar__layer-item'
      style={{
        paddingLeft: nestingLevel * (theme.unit * 3)
      }}
      onMouseDown={isDragGhost ? null : handleMouseDown}
      onMouseEnter={isDragGhost ? null : handleMouseEnter}
      onMouseLeave={isDragGhost ? null : handleMouseLeave}
      onContextMenu={isDragGhost ? null : handleContextMenu}
      onDoubleClick={isDragGhost ? null : handleDoubleClick}
      >
      <SidebarLayerBackground
        id={id}
        type={type}
        selected={selected}
        hover={hover}
        isDragGhost={isDragGhost} />
      <SidebarLayerChevron
        id={id}
        type={type}
        selected={selected}
        isOpen={isOpen}
        setOpen={setOpen}
        isDragGhost={isDragGhost} />
      <SidebarLayerMaskedIcon
        id={id}
        masked={masked}
        underlyingMask={underlyingMask}
        selected={selected}
        isDragGhost={isDragGhost} />
      <SidebarLayerIcon
        id={id}
        mask={mask}
        selected={selected}
        closed={closed}
        type={type}
        isDragGhost={isDragGhost} />
      <SidebarLayerTitle
        id={id}
        name={name}
        selected={selected}
        type={type}
        isDragGhost={isDragGhost} />
    </div>
  );
};

const mapStateToProps = (state: RootState, ownProps: SidebarLayerItemProps) => {
  const { leftSidebar } = state;
  const editing = leftSidebar.editing === ownProps.id;
  return { editing };
};

export default connect(
  mapStateToProps,
  { setLayerHover, openContextMenu, selectLayers, deselectLayers, setEditing }
)(SidebarLayerItem);