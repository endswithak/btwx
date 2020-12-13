import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleLeftSidebarThunk, toggleRightSidebarThunk, toggleTweenDrawerThunk } from '../store/actions/viewSettings';
import TopbarDropdownButton from './TopbarDropdownButton';

const InsertButton = (): ReactElement => {
  const leftSidebarOpen = useSelector((state: RootState) => state.viewSettings.leftSidebar.isOpen);
  const rightSidebarOpen = useSelector((state: RootState) => state.viewSettings.rightSidebar.isOpen);
  const tweenDrawerOpen = useSelector((state: RootState) => state.viewSettings.tweenDrawer.isOpen);
  const dispatch = useDispatch();

  return (
    <TopbarDropdownButton
      dropdownPosition='right'
      label='View'
      icon='left-sidebar'
      keepOpenOnSelect
      options={[{
        label: 'Layers',
        onClick: () => dispatch(toggleLeftSidebarThunk()),
        icon: 'left-sidebar',
        isActive: leftSidebarOpen,
        checkbox: true
      },{
        label: 'Styles',
        onClick: () => dispatch(toggleRightSidebarThunk()),
        icon: 'right-sidebar',
        isActive: rightSidebarOpen,
        checkbox: true
      },{
        label: 'Events',
        onClick: () => dispatch(toggleTweenDrawerThunk()),
        icon: 'tweens',
        isActive: tweenDrawerOpen,
        checkbox: true
      }]} />
  );
}

export default InsertButton;