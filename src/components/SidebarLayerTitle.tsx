import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import SidebarInput from './SidebarInput';
import { ThemeContext } from './ThemeProvider';
import { selectLayer, setLayerName, deselectLayer } from '../store/actions/layer';
import { SelectLayerPayload, DeselectLayerPayload, LayerTypes, SetLayerNamePayload } from '../store/actionTypes/layer';
import { openContextMenu } from '../store/actions/contextMenu';
import { OpenContextMenuPayload, ContextMenuTypes } from '../store/actionTypes/contextMenu';

interface SidebarLayerTitleProps {
  layer: em.Layer;
  editing: boolean;
  dragGhost: boolean;
  setDraggable(draggable: boolean): void;
  setEditing(editing: boolean): void;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
  deselectLayer?(payload: DeselectLayerPayload): LayerTypes;
  setLayerName?(payload: SetLayerNamePayload): LayerTypes;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
}

const SidebarLayerTitle = (props: SidebarLayerTitleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const [nameInput, setNameInput] = useState(props.layer.name);
  const { layer, editing, setEditing, dragGhost, setLayerName, setDraggable, selectLayer, deselectLayer, openContextMenu } = props;

  const handleClick = (e: React.MouseEvent) => {
    if (!editing) {
      if (e.metaKey) {
        if (layer.selected) {
          deselectLayer({id: layer.id});
        } else {
          selectLayer({id: layer.id});
        }
      } else {
        selectLayer({id: layer.id, newSelection: true});
      }
      setNameInput(props.layer.name);
    }
  }

  const handleDoubleClick = () => {
    setEditing(true);
    setDraggable(false);
  }

  const handleSubmit = () => {
    if (nameInput.replace(/\s/g, '').length > 0 && nameInput !== props.layer.name) {
      setLayerName({id: layer.id, name: nameInput});
    }
    setDraggable(true);
    setEditing(false);
  }

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setNameInput((e.target as HTMLInputElement).value);
  }

  const handleContextMenu = (e: any) => {
    if (!editing) {
      if (!layer.selected) {
        selectLayer({id: layer.id, newSelection: true});
      }
      openContextMenu({
        type: 'LayerEdit',
        id: layer.id,
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

  return (
    <div
      className={`
      c-sidebar-layer__name
      ${editing
        ? 'c-sidebar-layer__name--editing'
        : null
      }`}
      style={{
        color: layer.selected && !dragGhost
        ? theme.text.onPrimary
        : theme.text.base
      }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}>
      {
        editing
        ? <SidebarInput
            onChange={handleChange}
            value={nameInput}
            onSubmit={handleSubmit}
            submitOnBlur
            removedOnSubmit
            selectOnMount />
        : layer.name
      }
    </div>
  );
}

export default connect(
  null,
  { setLayerName, selectLayer, deselectLayer, openContextMenu }
)(SidebarLayerTitle);