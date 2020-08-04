import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { openRightSidebar, closeRightSidebar } from '../store/actions/rightSidebar';
import { RightSidebarTypes } from '../store/actionTypes/rightSidebar';
import TopbarButton from './TopbarButton';
import { paperMain } from '../canvas';

interface RightSidebarButtonProps {
  isRightSidebarOpen?: boolean;
  rightSidebarWidth?: number;
  openRightSidebar?(): RightSidebarTypes;
  closeRightSidebar?(): RightSidebarTypes;
}

const RightSidebarButton = (props: RightSidebarButtonProps): ReactElement => {
  const { isRightSidebarOpen, openRightSidebar, closeRightSidebar, rightSidebarWidth } = props;

  const handleClick = () => {
    if (isRightSidebarOpen) {
      paperMain.view.viewSize = new paperMain.Size(paperMain.view.viewSize.width + rightSidebarWidth, paperMain.view.viewSize.height);
      closeRightSidebar();
    } else {
      paperMain.view.viewSize = new paperMain.Size(paperMain.view.viewSize.width - rightSidebarWidth, paperMain.view.viewSize.height);
      openRightSidebar();
    }
  }

  return (
    <TopbarButton
      label='Styles'
      onClick={handleClick}
      icon='M15.001,8 L21,8 L21,8 L21,21 L15,21 L15,8.001 C15,8.00044772 15.0004477,8 15.001,8 Z'
      iconOpacity='M14,8 L14,21 L3,21 L3,8 L14,8 Z M21,3 L21,7 L3,7 L3,3.001 C3,3.00044772 3.00044772,3 3.001,3 L21,3 L21,3 Z'
      isActive={isRightSidebarOpen} />
  );
}

const mapStateToProps = (state: RootState): {
  isRightSidebarOpen: boolean;
  rightSidebarWidth: number;
} => {
  const { rightSidebar, canvasSettings } = state;
  const isRightSidebarOpen = rightSidebar.isOpen;
  const rightSidebarWidth = canvasSettings.rightSidebarWidth;
  return { isRightSidebarOpen, rightSidebarWidth };
};

export default connect(
  mapStateToProps,
  { openRightSidebar, closeRightSidebar }
)(RightSidebarButton);