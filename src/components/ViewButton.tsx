import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleLeftSidebarThunk, toggleRightSidebarThunk, toggleTweenDrawerThunk } from '../store/actions/viewSettings';
import TopbarDropdownButton from './TopbarDropdownButton';

interface InsertButtonProps {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  tweenDrawerOpen: boolean;
  toggleLeftSidebarThunk?(): void;
  toggleRightSidebarThunk?(): void;
  toggleTweenDrawerThunk?(): void;
}

const InsertButton = (props: InsertButtonProps): ReactElement => {
  const {
    leftSidebarOpen,
    rightSidebarOpen,
    tweenDrawerOpen,
    toggleLeftSidebarThunk,
    toggleRightSidebarThunk,
    toggleTweenDrawerThunk
  } = props;

  return (
    <TopbarDropdownButton
      label='View'
      icon='left-sidebar'
      options={[{
        label: `${leftSidebarOpen ? 'Hide' : 'Show'} Layers`,
        onClick: toggleLeftSidebarThunk,
        icon: 'left-sidebar',
        isActive: leftSidebarOpen
      },{
        label: `${rightSidebarOpen ? 'Hide' : 'Show'} Styles`,
        onClick: toggleRightSidebarThunk,
        icon: 'right-sidebar',
        isActive: rightSidebarOpen
      },{
        label: `${tweenDrawerOpen ? 'Hide' : 'Show'} Events`,
        onClick: toggleTweenDrawerThunk,
        icon: 'tweens',
        isActive: tweenDrawerOpen
      }]} />
  );
}

const mapStateToProps = (state: RootState): {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  tweenDrawerOpen: boolean;
} => {
  const { viewSettings } = state;
  const leftSidebarOpen = viewSettings.leftSidebar.isOpen;
  const rightSidebarOpen = viewSettings.rightSidebar.isOpen;
  const tweenDrawerOpen = viewSettings.tweenDrawer.isOpen;
  return { leftSidebarOpen, rightSidebarOpen, tweenDrawerOpen };
};

export default connect(
  mapStateToProps,
  { toggleLeftSidebarThunk, toggleRightSidebarThunk, toggleTweenDrawerThunk }
)(InsertButton);