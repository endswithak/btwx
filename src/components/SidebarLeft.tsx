import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import Sidebar from './Sidebar';
import SidebarLayerTree from './SidebarLayerTree';
import SidebarLeftDragHandle from './SidebarLeftDragHandle';

interface SidebarLeftProps {
  sidebarWidth: number;
  ready: boolean;
}

const SidebarLeft = (props: SidebarLeftProps): ReactElement => {
  const { sidebarWidth, ready } = props;
  return (
    <>
      <SidebarLeftDragHandle />
      <Sidebar
        width={sidebarWidth}
        position='left'>
        {
          ready
          ? <SidebarLayerTree />
          : null
        }
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