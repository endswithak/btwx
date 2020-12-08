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
      keepOpenOnSelect
      options={[{
        label: 'Layers',
        onClick: toggleLeftSidebarThunk,
        icon: 'left-sidebar',
        isActive: leftSidebarOpen,
        checkbox: true
      },{
        label: 'Styles',
        onClick: toggleRightSidebarThunk,
        icon: 'right-sidebar',
        isActive: rightSidebarOpen,
        checkbox: true
      },{
        label: 'Events',
        onClick: toggleTweenDrawerThunk,
        icon: 'tweens',
        isActive: tweenDrawerOpen,
        checkbox: true
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