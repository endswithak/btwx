import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import Sidebar from './Sidebar';
import SidebarLayerTree from './SidebarLayerTree';
import SidebarLeftDragHandle from './SidebarLeftDragHandle';

interface SidebarLeftProps {
  sidebarWidth: number;
}

const SidebarLeft = (props: SidebarLeftProps): ReactElement => {
  const { sidebarWidth } = props;
  return (
    <>
      <SidebarLeftDragHandle />
      <Sidebar
        width={sidebarWidth}
        position='left'>
        <SidebarLayerTree />
      </Sidebar>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { canvasSettings } = state;
  const sidebarWidth = canvasSettings.leftSidebarWidth;
  return { sidebarWidth };
};

export default connect(
  mapStateToProps
)(SidebarLeft);