import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { openRightSidebar, closeRightSidebar } from '../store/actions/rightSidebar';
import { RightSidebarTypes } from '../store/actionTypes/rightSidebar';
import { paperMain } from '../canvas';
import TopbarButton from './TopbarButton';

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
      icon='right-sidebar'
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