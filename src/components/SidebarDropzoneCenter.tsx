import React, { useContext, ReactElement, useState, useRef, SyntheticEvent, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { addLayerChildren } from '../store/actions/layer';
import { AddLayerChildrenPayload } from '../store/actionTypes/layer';
import { LayerTypes } from '../store/actionTypes/layer';
import { SetDraggingPayload, SetDropzonePayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { setDragging, setDropzone } from '../store/actions/leftSidebar';
import { ThemeContext } from './ThemeProvider';

interface SidebarDropzoneCenterProps {
  layer: string;
  layerItem?: Btwx.Layer;
  selected?: string[];
  selectedById?: {
    [id: string]: Btwx.Layer;
  };
  dropzone?: Btwx.Dropzone;
  isActive?: boolean;
  setDragging?(payload: SetDraggingPayload): LeftSidebarTypes;
  setDropzone?(payload: SetDropzonePayload): LeftSidebarTypes;
  addLayerChildren?(payload: AddLayerChildrenPayload): LayerTypes;
}

const SidebarDropzoneCenter = (props: SidebarDropzoneCenterProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  // const [active, setActive] = useState(false);
  const theme = useContext(ThemeContext);
  const { layerItem, layer, selected, selectedById, setDragging, addLayerChildren, dropzone, setDropzone, isActive } = props;

  const debounceDropzone = useCallback(
    debounce((payload: SetDropzonePayload) => {
      setDropzone(payload);
    }, 20),
    []
  );

  const handleDragOver = (e: SyntheticEvent) => {
    if (!selected.some((id) => document.getElementById(id).contains(ref.current))) {
      if (selected.some((id) => selectedById[id].type === 'Artboard') && (layerItem.type === 'Artboard' || layerItem.type === 'Group')) {
        return;
      } else {
        e.preventDefault();
        debounceDropzone({dropzone: 'center'});
        // setActive(true);
      }
    }
  }

  const handleDragLeave = (e: SyntheticEvent) => {
    // setActive(false);
  }

  const handleDrop = (e: SyntheticEvent) => {
    if (isActive) {
      e.preventDefault();
      addLayerChildren({
        id: layer,
        children: selected
      });
      setDragging({dragging: null});
    }
    // if (active) {
    //   e.preventDefault();
    //   addLayerChildren({
    //     id: layer,
    //     children: selected
    //   });
    //   setActive(false);
    // }
    // setDragging({dragging: null});
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
          boxShadow: isActive ? `0 0 0 ${theme.unit / 2}px ${theme.palette.primary} inset` : ''
        }}
        />
    : null
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarDropzoneCenterProps) => {
  const { layer, leftSidebar } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const selected = layer.present.selected;
  const selectedById = selected.reduce((result: {[id: string]: Btwx.Layer}, current) => {
    result[current] = layer.present.byId[current];
    return result;
  }, {});
  const dropzone = leftSidebar.dropzone;
  const isActive = dropzone === 'center';
  return { layerItem, selectedById, selected, dropzone, isActive };
};

export default connect(
  mapStateToProps,
  { addLayerChildren, setDragging, setDropzone }
)(SidebarDropzoneCenter);