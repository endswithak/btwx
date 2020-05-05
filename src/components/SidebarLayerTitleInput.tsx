import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { selectLayer, setLayerName } from '../store/actions/layer';
import { SelectLayerPayload, NewLayerScopePayload, LayerTypes, SetLayerNamePayload } from '../store/actionTypes/layer';
import SidebarInput from './SidebarInput';

interface SidebarLayerTitleProps {
  layer: em.Layer;
  setDraggable(draggable: boolean): void;
  setEditing(editing: boolean): void;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
  setLayerName?(payload: SetLayerNamePayload): LayerTypes;
}

const SidebarLayerTitleInput = (props: SidebarLayerTitleProps): ReactElement => {
  const [nameInput, setNameInput] = useState(props.layer.name);
  const { layer, setEditing, setLayerName, setDraggable, selectLayer } = props;

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
    <SidebarInput
      onChange={handleChange}
      value={nameInput}
      onSubmit={handleSubmit}
      selectOnMount />
  );
}

export default connect(
  null,
  { setLayerName, selectLayer }
)(SidebarLayerTitleInput);