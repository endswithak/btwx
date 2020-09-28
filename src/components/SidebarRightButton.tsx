import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleRightSidebarThunk } from '../store/actions/documentSettings';
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
  const { documentSettings } = state;
  const isRightSidebarOpen = documentSettings.view.rightSidebar.isOpen;
  return { isRightSidebarOpen };
};

export default connect(
  mapStateToProps,
  { toggleRightSidebarThunk }
)(SidebarRightButton);