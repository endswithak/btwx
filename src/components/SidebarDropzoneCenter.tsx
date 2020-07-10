import React, { useContext, ReactElement, useState, useRef, SyntheticEvent } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { addLayerChildren } from '../store/actions/layer';
import { AddLayerChildrenPayload } from '../store/actionTypes/layer';
import { LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';

interface SidebarDropzoneCenterProps {
  layer: em.Layer;
  dragLayers: string[];
  dragLayerById?: {
    [id: string]: em.Layer;
  };
  setDragLayers(layers: string[]): void;
  setDragging(dragging: boolean): void;
  addLayerChildren?(payload: AddLayerChildrenPayload): LayerTypes;
}

const SidebarDropzoneCenter = (props: SidebarDropzoneCenterProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const theme = useContext(ThemeContext);
  const { layer, dragLayers, dragLayerById, setDragLayers, setDragging, addLayerChildren } = props;

  const handleDragOver = (e: SyntheticEvent) => {
    if (!dragLayers.some((id) => document.getElementById(id).contains(ref.current))) {
      if (dragLayers.some((id) => dragLayerById[id].type === 'Artboard') && (layer.type === 'Artboard' || layer.type === 'Group')) {
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
        id: layer.id,
        children: dragLayers
      });
    }
    setDragLayers(null);
    setDragging(false);
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
  const dragLayerById = ownProps.dragLayers ? ownProps.dragLayers.reduce((result: {[id: string]: em.Layer}, current) => {
    result[current] = layer.present.byId[current];
    return result;
  }, {}) : {};
  return { dragLayerById };
};

export default connect(
  mapStateToProps,
  { addLayerChildren }
)(SidebarDropzoneCenter);