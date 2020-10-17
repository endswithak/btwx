import React, { useContext, ReactElement, useState, useRef } from 'react';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { insertLayersAbove } from '../store/actions/layer';
import { InsertLayersAbovePayload, LayerTypes } from '../store/actionTypes/layer';
import { SetDraggingPayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { setDragging } from '../store/actions/leftSidebar';
import { ThemeContext } from './ThemeProvider';

interface SidebarDropzoneBottomProps {
  leftSidebarWidth?: number;
  layerItem?: em.Layer;
  layer: string;
  depth?: number;
  selected?: string[];
  selectedById?: {
    [id: string]: em.Layer;
  };
  setDragging?(payload: SetDraggingPayload): LeftSidebarTypes;
  insertLayersAbove?(payload: InsertLayersAbovePayload): LayerTypes;
}

interface DropzoneProps {
  active: boolean;
}

const Dropzone = styled.div<DropzoneProps>`
  box-shadow: ${props => props.active ? `0 ${props.theme.unit / 2}px 0 0 ${props.theme.palette.primary}` : 'none'};
  width: 100%;
  height: 100%;
  :before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    left: -4px;
    bottom: -4.5px;
    background: ${props => props.active ? props.theme.palette.primary : 'none'};
  }
`;

const SidebarDropzoneBottom = (props: SidebarDropzoneBottomProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const theme = useContext(ThemeContext);
  const { layerItem, layer, depth, selected, selectedById, setDragging, insertLayersAbove, leftSidebarWidth } = props;

  const handleDragOver = (e: any) => {
    if (!selected.some((id) => document.getElementById(id).contains(ref.current))) {
      if (selected.some((id) => selectedById[id].type === 'Artboard') && layerItem.parent !== 'page') {
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
      insertLayersAbove({
        layers: selected,
        above: layer
      });
    }
    setDragging({dragging: false});
  }

  return (
    <div
      ref={ref}
      className='c-sidebar-dropzone__zone c-sidebar-dropzone__zone--bottom'
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        width: document.getElementById(`${layer}-icon`) ? document.getElementById(`${layer}-mask-icon`) ? leftSidebarWidth - document.getElementById(`${layer}-mask-icon`).getBoundingClientRect().x : leftSidebarWidth - document.getElementById(`${layer}-icon`).getBoundingClientRect().x : 0,
        height: layerItem.children ? theme.unit * 2 : theme.unit * 4
      }}>
      <Dropzone
        active={active}
        theme={theme} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarDropzoneBottomProps) => {
  const { layer, viewSettings } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const selected = layer.present.selected;
  const selectedById = selected.reduce((result: {[id: string]: em.Layer}, current) => {
    result[current] = layer.present.byId[current];
    return result;
  }, {});
  const leftSidebarWidth = viewSettings.leftSidebar.width;
  const depth = layerItem.scope.length - 1;
  return { layerItem, selectedById, leftSidebarWidth, selected, depth };
};

export default connect(
  mapStateToProps,
  { insertLayersAbove, setDragging }
)(SidebarDropzoneBottom);