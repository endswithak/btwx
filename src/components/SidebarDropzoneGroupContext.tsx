import React, { useContext, ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { addLayerChildren } from '../store/actions/layer';
import { setDragging } from '../store/actions/leftSidebar';
import { ThemeContext } from './ThemeProvider';

interface SidebarDropzoneGroupContextProps {
  layer: string;
  isDragGhost?: boolean;
  isEnabled?: boolean;
}

const SidebarDropzoneGroupContext = (props: SidebarDropzoneGroupContextProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, layer, isDragGhost } = props;

  return (
    isEnabled
    ? <div
        className={`c-sidebar-dropzone__zone c-sidebar-dropzone__zone--center`}
        style={{
          boxShadow: `0 0 0 ${theme.unit / 2}px ${theme.palette.primary} inset`,
          pointerEvents: 'none'
        }} />
    : null
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarDropzoneGroupContextProps) => {
  const { layer, leftSidebar } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const dragOver = leftSidebar.dragOver;
  const dragOverItem = dragOver ? layer.present.byId[dragOver] : null;
  const isGroup = layerItem.type === 'Group' || layerItem.type === 'Artboard';
  const isDragOverGroup = dragOverItem && (dragOverItem.type === 'Group' || dragOverItem.type === 'Artboard');
  const isEnabled = dragOver && !ownProps.isDragGhost && dragOverItem.parent === ownProps.layer && (dragOverItem.type !== 'Group' && dragOverItem.type !== 'Artboard');
  return { isEnabled };
};

export default connect(
  mapStateToProps,
  { addLayerChildren, setDragging }
)(SidebarDropzoneGroupContext);