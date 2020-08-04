import React, { useContext, ReactElement, useState, useRef, SyntheticEvent } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { insertLayersBelow } from '../store/actions/layer';
import { InsertLayersBelowPayload } from '../store/actionTypes/layer';
import { LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';

interface SidebarDropzoneBottomProps {
  leftSidebarWidth?: number;
  layer: em.Layer;
  depth: number;
  dragLayers: string[];
  dragLayerById?: {
    [id: string]: em.Layer;
  };
  setDragLayers(layers: string[]): void;
  setDragging(dragging: boolean): void;
  insertLayersBelow?(payload: InsertLayersBelowPayload): LayerTypes;
}

const SidebarDropzoneBottom = (props: SidebarDropzoneBottomProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const theme = useContext(ThemeContext);
  const { layer, depth, dragLayers, dragLayerById, setDragLayers, setDragging, insertLayersBelow, leftSidebarWidth } = props;

  const handleDragOver = (e: SyntheticEvent) => {
    if (dragLayers && !dragLayers.some((id) => document.getElementById(id).contains(ref.current))) {
      if (dragLayers.some((id) => dragLayerById[id].type === 'Artboard') && layer.parent !== 'page') {
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
      insertLayersBelow({
        layers: dragLayers,
        below: layer.id
      });
    }
    setDragLayers(null);
    setDragging(false);
  }

  return (
    <div
      ref={ref}
      className={`c-sidebar-dropzone__zone c-sidebar-dropzone__zone--bottom`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        width: leftSidebarWidth - (depth * (theme.unit * 6)),
        boxShadow: active ? `0 ${theme.unit / 2}px 0 0 ${theme.palette.primary}` : '',
        height: layer.children ? theme.unit * 2 : theme.unit * 4
      }} />
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarDropzoneBottomProps) => {
  const { layer, canvasSettings } = state;
  const dragLayerById = ownProps.dragLayers ? ownProps.dragLayers.reduce((result: {[id: string]: em.Layer}, current) => {
    result[current] = layer.present.byId[current];
    return result;
  }, {}) : {};
  const leftSidebarWidth = canvasSettings.leftSidebarWidth;
  return { dragLayerById, leftSidebarWidth };
};

export default connect(
  mapStateToProps,
  { insertLayersBelow }
)(SidebarDropzoneBottom);