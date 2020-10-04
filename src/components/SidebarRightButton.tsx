import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleRightSidebarThunk } from '../store/actions/viewSettings';
import TopbarButton from './TopbarButton';

interface SidebarRightButtonProps {
  isRightSidebarOpen?: boolean;
  toggleRightSidebarThunk?(): void;
}

const SidebarRightButton = (props: SidebarRightButtonProps): ReactElement => {
  const { isRightSidebarOpen, toggleRightSidebarThunk } = props;

  const handleClick = () => {
    toggleRightSidebarThunk();
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
} => {
  const { viewSettings } = state;
  const isRightSidebarOpen = viewSettings.rightSidebar.isOpen;
  return { isRightSidebarOpen };
};

export default connect(
  mapStateToProps,
  { toggleRightSidebarThunk }
)(SidebarRightButton);