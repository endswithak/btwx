import React, { useContext, ReactElement, useState, useRef, SyntheticEvent } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { addLayerChild } from '../store/actions/layer';
import { AddLayerChildPayload } from '../store/actionTypes/layer';
import { LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';

interface SidebarDropzoneCenterProps {
  layer: em.Layer;
  dragLayer: string;
  dragLayerItem?: em.Layer;
  setDragLayer(id: string): void;
  addLayerChild?(payload: AddLayerChildPayload): LayerTypes;
}

const SidebarDropzoneCenter = (props: SidebarDropzoneCenterProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const theme = useContext(ThemeContext);
  const { layer, dragLayer, dragLayerItem, setDragLayer, addLayerChild } = props;

  const handleDragOver = (e: SyntheticEvent) => {
    if (!document.getElementById(dragLayer).contains(ref.current)) {
      if (dragLayerItem.type === 'Artboard' && (layer.type === 'Artboard' || layer.type === 'Group')) {
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
      addLayerChild({
        id: layer.id,
        child: dragLayer
      });
    }
    setDragLayer(null);
  }

  return (
    layer.children
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
  const dragLayerItem = layer.present.byId[ownProps.dragLayer];
  return { dragLayerItem };
};

export default connect(
  mapStateToProps,
  { addLayerChild }
)(SidebarDropzoneCenter);