import React, { useContext, ReactElement, useState, useRef } from 'react';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { insertLayersBelow } from '../store/actions/layer';
import { InsertLayersBelowPayload, LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';

interface SidebarDropzoneTopProps {
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

interface DropzoneProps {
  active: boolean;
}

const Dropzone = styled.div<DropzoneProps>`
  box-shadow: ${props => props.active ? `0 ${props.theme.unit / 2}px 0 0 ${props.theme.palette.primary} inset` : 'none'};
  width: 100%;
  height: 100%;
  :before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    left: -4px;
    top: -3.5px;
    background: ${props => props.active ? props.theme.palette.primary : 'none'};
  }
`;

const SidebarDropzoneTop = (props: SidebarDropzoneTopProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const theme = useContext(ThemeContext);
  const { layer, depth, dragLayers, dragLayerById, setDragLayers, setDragging, insertLayersBelow, leftSidebarWidth } = props;

  const handleDragOver = (e: any) => {
    if (!dragLayers.some((id) => document.getElementById(id).contains(ref.current))) {
      if (dragLayers.some((id) => dragLayerById[id].type === 'Artboard') && layer.parent !== 'page') {
        return;
      } else {
        e.preventDefault();
        setActive(true);
      }
    }
  }

  const handleDragLeave = (e: any) => {
    setActive(false);
  }

  const handleDrop = (e: any) => {
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
      className='c-sidebar-dropzone__zone c-sidebar-dropzone__zone--top'
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        width: leftSidebarWidth - (depth * (theme.unit * 1.44)),
        height: layer.children ? theme.unit * 2 : theme.unit * 4
      }}>
      <Dropzone
        active={active}
        theme={theme} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarDropzoneTopProps) => {
  const { layer, documentSettings } = state;
  const dragLayerById = ownProps.dragLayers ? ownProps.dragLayers.reduce((result: {[id: string]: em.Layer}, current) => {
    result[current] = layer.present.byId[current];
    return result;
  }, {}) : {};
  const leftSidebarWidth = documentSettings.leftSidebarWidth;
  return { dragLayerById, leftSidebarWidth };
};

export default connect(
  mapStateToProps,
  { insertLayersBelow }
)(SidebarDropzoneTop);