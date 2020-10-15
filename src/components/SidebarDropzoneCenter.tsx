import React, { useContext, ReactElement, useState, useRef, SyntheticEvent } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { addLayerChildren } from '../store/actions/layer';
import { AddLayerChildrenPayload } from '../store/actionTypes/layer';
import { LayerTypes } from '../store/actionTypes/layer';
import { SetDraggingPayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { setDragging } from '../store/actions/leftSidebar';
import { ThemeContext } from './ThemeProvider';

interface SidebarDropzoneCenterProps {
  layer: string;
  layerItem?: em.Layer;
  selected?: string[];
  selectedById?: {
    [id: string]: em.Layer;
  };
  setDragging?(payload: SetDraggingPayload): LeftSidebarTypes;
  addLayerChildren?(payload: AddLayerChildrenPayload): LayerTypes;
}

const SidebarDropzoneCenter = (props: SidebarDropzoneCenterProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const theme = useContext(ThemeContext);
  const { layerItem, layer, selected, selectedById, setDragging, addLayerChildren } = props;

  const handleDragOver = (e: SyntheticEvent) => {
    if (!selected.some((id) => document.getElementById(id).contains(ref.current))) {
      if (selected.some((id) => selectedById[id].type === 'Artboard') && (layerItem.type === 'Artboard' || layerItem.type === 'Group')) {
        return;
      } else {
        e.preventDefault();
        setActive(true);
      }
    }
  }

  const handleDragLeave = (e: SyntheticEvent) => {
    setActive(false);
  }

  const handleDrop = (e: SyntheticEvent) => {
    if (active) {
      e.preventDefault();
      addLayerChildren({
        id: layer,
        children: selected
      });
    }
    setDragging({dragging: false});
  }

  return (
    layerItem.children
    ? <div
        ref={ref}
        className={`c-sidebar-dropzone__zone c-sidebar-dropzone__zone--center`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          boxShadow: active ? `0 0 0 ${theme.unit / 2}px ${theme.palette.primary} inset` : ''
        }} />
    : null
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarDropzoneCenterProps) => {
  const { layer } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const selected = layer.present.selected;
  const selectedById = selected.reduce((result: {[id: string]: em.Layer}, current) => {
    result[current] = layer.present.byId[current];
    return result;
  }, {});
  return { layerItem, selectedById, selected };
};

export default connect(
  mapStateToProps,
  { addLayerChildren, setDragging }
)(SidebarDropzoneCenter);