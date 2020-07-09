import React, { useContext, ReactElement, useState, useRef, SyntheticEvent } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { insertLayerBelow } from '../store/actions/layer';
import { InsertLayerBelowPayload } from '../store/actionTypes/layer';
import { LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';

interface SidebarDropzoneBottomProps {
  layer: em.Layer;
  depth: number;
  dragLayer: string;
  dragLayerItem?: em.Layer;
  setDragLayer(id: string): void;
  insertLayerBelow?(payload: InsertLayerBelowPayload): LayerTypes;
}

const SidebarDropzoneBottom = (props: SidebarDropzoneBottomProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const theme = useContext(ThemeContext);
  const { layer, depth, dragLayer, dragLayerItem, setDragLayer, insertLayerBelow } = props;

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
      insertLayerBelow({
        id: dragLayer,
        below: layer.id
      });
    }
    setDragLayer(null);
  }

  return (
    <div
      ref={ref}
      className={`c-sidebar-dropzone__zone c-sidebar-dropzone__zone--bottom`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        width: 320 - (depth * (theme.unit * 6)),
        boxShadow: active ? `0 ${theme.unit / 2}px 0 0 ${theme.palette.primary}` : '',
        height: layer.children ? theme.unit * 2 : theme.unit * 4
      }} />
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarDropzoneBottomProps) => {
  const { layer } = state;
  const dragLayerItem = layer.present.byId[ownProps.dragLayer];
  return { dragLayerItem };
};

export default connect(
  mapStateToProps,
  { insertLayerBelow }
)(SidebarDropzoneBottom);