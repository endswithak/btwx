import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleLeftSidebarThunk, toggleRightSidebarThunk, toggleEventDrawerThunk } from '../store/actions/viewSettings';
import TopbarDropdownButton from './TopbarDropdownButton';

const InsertButton = (): ReactElement => {
  const leftSidebarOpen = useSelector((state: RootState) => state.viewSettings.leftSidebar.isOpen);
  const rightSidebarOpen = useSelector((state: RootState) => state.viewSettings.rightSidebar.isOpen);
  const eventDrawerOpen = useSelector((state: RootState) => state.viewSettings.eventDrawer.isOpen);
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
        onClick: () => dispatch(toggleEventDrawerThunk()),
        icon: 'tweens',
        isActive: eventDrawerOpen,
        checkbox: true
      }]} />
  );
}

export default InsertButton;