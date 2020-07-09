import React, { useContext, ReactElement, useState, useRef, SyntheticEvent } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { insertLayerAbove } from '../store/actions/layer';
import { InsertLayerAbovePayload } from '../store/actionTypes/layer';
import { LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';

interface SidebarDropzoneTopProps {
  layer: em.Layer;
  depth: number;
  dragLayer: string;
  dragLayerItem?: em.Layer;
  setDragLayer(id: string): void;
  insertLayerAbove?(payload: InsertLayerAbovePayload): LayerTypes;
}

const SidebarDropzoneTop = (props: SidebarDropzoneTopProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const theme = useContext(ThemeContext);
  const { layer, depth, dragLayer, dragLayerItem, setDragLayer, insertLayerAbove } = props;

  const handleDragOver = (e: SyntheticEvent) => {
    if (!document.getElementById(dragLayer).contains(ref.current)) {
      if (dragLayerItem.type === 'Artboard' && layer.parent !== 'page') {
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
      insertLayerAbove({
        id: dragLayer,
        above: layer.id
      });
    }
    setDragLayer(null);
  }

  return (
    <div
      ref={ref}
      className={`c-sidebar-dropzone__zone c-sidebar-dropzone__zone--top`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        width: 320 - (depth * (theme.unit * 6)),
        boxShadow: active ? `0 ${theme.unit / 2}px 0 0 ${theme.palette.primary} inset` : '',
        height: layer.children ? theme.unit * 2 : theme.unit * 4
      }} />
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarDropzoneTopProps) => {
  const { layer } = state;
  const dragLayerItem = layer.present.byId[ownProps.dragLayer];
  return { dragLayerItem };
};

export default connect(
  mapStateToProps,
  { insertLayerAbove }
)(SidebarDropzoneTop);