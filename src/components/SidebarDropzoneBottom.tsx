import React, { useContext, ReactElement, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { insertLayersBelow } from '../store/actions/layer';
import { InsertLayersBelowPayload, LayerTypes } from '../store/actionTypes/layer';
import { SetDraggingPayload, SetDropzonePayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { setDragging, setDropzone } from '../store/actions/leftSidebar';
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
  dropzone?: em.Dropzone;
  isActive?: boolean;
  setDragging?(payload: SetDraggingPayload): LeftSidebarTypes;
  setDropzone?(payload: SetDropzonePayload): LeftSidebarTypes;
  insertLayersBelow?(payload: InsertLayersBelowPayload): LayerTypes;
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
  // const [active, setActive] = useState(false);
  const theme = useContext(ThemeContext);
  const { layerItem, dropzone, isActive, layer, depth, selected, selectedById, setDragging, insertLayersBelow, leftSidebarWidth, setDropzone } = props;

  const debounceDropzone = useCallback(
    debounce((payload: SetDropzonePayload) => {
      setDropzone(payload);
    }, 20),
    []
  );

  const handleDragOver = (e: any) => {
    if (!selected.some((id) => document.getElementById(id).contains(ref.current))) {
      if (selected.some((id) => selectedById[id].type === 'Artboard') && layerItem.parent !== 'page') {
        return;
      } else {
        e.preventDefault();
        debounceDropzone({dropzone: 'bottom'});
        // setActive(true);
      }
    }
  }

  const handleDragLeave = (e: any) => {
    // setActive(false);
  }

  const handleDrop = (e: any) => {
    if (isActive) {
      e.preventDefault();
      insertLayersBelow({
        layers: selected,
        below: layer
      });
      setDragging({dragging: null});
    }
    // if (active) {
    //   e.preventDefault();
    //   insertLayersBelow({
    //     layers: selected,
    //     below: layer
    //   });
    //   setActive(false);
    // }
    // setDragging({dragging: null});
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
        active={isActive}
        theme={theme} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarDropzoneBottomProps) => {
  const { layer, viewSettings, leftSidebar } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const selected = layer.present.selected;
  const selectedById = selected.reduce((result: {[id: string]: em.Layer}, current) => {
    result[current] = layer.present.byId[current];
    return result;
  }, {});
  const leftSidebarWidth = viewSettings.leftSidebar.width;
  const depth = layerItem.scope.length - 1;
  const dropzone = leftSidebar.dropzone;
  const isActive = dropzone === 'bottom';
  return { layerItem, selectedById, leftSidebarWidth, selected, depth, dropzone, isActive };
};

export default connect(
  mapStateToProps,
  { insertLayersBelow, setDragging, setDropzone }
)(SidebarDropzoneBottom);