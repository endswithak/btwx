import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { selectLayer, setLayerName, deselectLayer, deselectAllLayers } from '../store/actions/layer';
import { SelectLayerPayload, DeselectLayerPayload, LayerTypes, SetLayerNamePayload } from '../store/actionTypes/layer';
import SidebarInput from './SidebarInput';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerTitleProps {
  layer: em.Layer;
  editing: boolean;
  dragGhost: boolean;
  setDraggable(draggable: boolean): void;
  setEditing(editing: boolean): void;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
  deselectLayer?(payload: DeselectLayerPayload): LayerTypes;
  deselectAllLayers?(): LayerTypes;
  setLayerName?(payload: SetLayerNamePayload): LayerTypes;
}

const SidebarLayerTitle = (props: SidebarLayerTitleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const [nameInput, setNameInput] = useState(props.layer.name);
  const { layer, editing, setEditing, dragGhost, setLayerName, setDraggable, selectLayer, deselectLayer, deselectAllLayers } = props;

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
    deselectAllLayers();
    setEditing(true);
    setDraggable(false);
  }

  const handleSubmit = () => {
    setLayerName({id: layer.id, name: nameInput});
    selectLayer({id: layer.id, newSelection: true});
    setDraggable(true);
    setEditing(false);
  }

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setNameInput((e.target as HTMLInputElement).value);
  }

  return (
    <div
      className={`
      c-sidebar-layer__name
      ${editing
        ? `c-sidebar-layer__name--editing`
        : null
      }`}
      style={{
        color: layer.selected && !dragGhost
        ? theme.text.onPrimary
        : theme.text.base
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}>
      {
        editing
        ? <SidebarInput
            onChange={handleChange}
            value={nameInput}
            onSubmit={handleSubmit}
            onBlur={handleSubmit}
            blurOnSubmit
            selectOnMount />
        : layer.name
      }
    </div>
  );
}

export default connect(
  null,
  { setLayerName, selectLayer, deselectLayer, deselectAllLayers }
)(SidebarLayerTitle);