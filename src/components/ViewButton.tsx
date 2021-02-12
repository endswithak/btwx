/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleLeftSidebarThunk, toggleRightSidebarThunk, toggleEventDrawerThunk } from '../store/actions/viewSettings';
import TopbarDropdownButton from './TopbarDropdownButton';
import ToggleListGroup from './ToggleListGroup';
import ToggleListItem from './ToggleListItem';
import ListItemBody from './ListItemBody';
import Text from './Text';
import Icon from './Icon';
import StackedButton from './StackedButton';

const InsertButton = (): ReactElement => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const leftSidebarOpenValue = useSelector((state: RootState) => state.viewSettings.leftSidebar.isOpen);
  const rightSidebarOpenValue = useSelector((state: RootState) => state.viewSettings.rightSidebar.isOpen);
  const eventDrawerOpenValue = useSelector((state: RootState) => state.viewSettings.eventDrawer.isOpen);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(leftSidebarOpenValue);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(rightSidebarOpenValue);
  const [eventDrawerOpen, setEventDrawerOpen] = useState(eventDrawerOpenValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();

  const onMouseDown = (event: any): void => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown();
    }
  }

  const handleClick = (event: React.SyntheticEvent): void => {
    showDropdown ? closeDropdown() : openDropdown();
    // if (onClick) {
    //   onClick(event);
    // }
  }

  const closeDropdown = (): void => {
    setShowDropdown(false);
    document.removeEventListener('mousedown', onMouseDown);
  }

  const openDropdown = (): void => {
    setShowDropdown(true);
    document.addEventListener('mousedown', onMouseDown, false);
  }

  const handleLeftSidebarChange = (e: any): void => {
    dispatch(toggleLeftSidebarThunk());
    setLeftSidebarOpen(!leftSidebarOpen);
  }

  const handleRightSidebarChange = (e: any): void => {
    dispatch(toggleRightSidebarThunk());
    setRightSidebarOpen(!rightSidebarOpen);
  }

  const handleEventsChange = (e: any): void => {
    dispatch(toggleEventDrawerThunk());
    setEventDrawerOpen(!eventDrawerOpen);
  }

  return (
    <div
      className='c-topbar-dropdown-button'
      ref={dropdownRef}>
      <StackedButton
        label='View'
        onClick={handleClick}
        iconName='left-sidebar'
        size='small'
        isActive={showDropdown} />
      {
        showDropdown
        ? <div className='c-topbar-dropdown-button__dropdown c-topbar-dropdown-button__dropdown--right'>
            <ToggleListItem
              name='layers'
              type='checkbox'
              onChange={handleLeftSidebarChange}
              value={leftSidebarOpen}
              checked={leftSidebarOpen}>
              <Icon name='left-sidebar' />
              <ListItemBody>
                <Text size='small'>Layers</Text>
              </ListItemBody>
            </ToggleListItem>
            <ToggleListItem
              name='styles'
              type='checkbox'
              onChange={handleRightSidebarChange}
              value={rightSidebarOpen}
              checked={rightSidebarOpen}>
              <Icon name='right-sidebar' />
              <ListItemBody>
                <Text size='small'>Styles</Text>
              </ListItemBody>
            </ToggleListItem>
            <ToggleListItem
              name='events'
              type='checkbox'
              onChange={handleEventsChange}
              value={eventDrawerOpen}
              checked={eventDrawerOpen}>
              <Icon name='tweens' />
              <ListItemBody>
                <Text size='small'>Events</Text>
              </ListItemBody>
            </ToggleListItem>
          </div>
        : null
      }
    </div>
    // <TopbarDropdownButton
    //   dropdownPosition='right'
    //   label='View'
    //   icon='left-sidebar'
    //   keepOpenOnSelect
    //   options={[{
    //     label: 'Layers',
    //     onClick: () => dispatch(toggleLeftSidebarThunk()),
    //     icon: 'left-sidebar',
    //     isActive: leftSidebarOpen,
    //     checkbox: true
    //   },{
    //     label: 'Styles',
    //     onClick: () => dispatch(toggleRightSidebarThunk()),
    //     icon: 'right-sidebar',
    //     isActive: rightSidebarOpen,
    //     checkbox: true
    //   },{
    //     label: 'Events',
    //     onClick: () => dispatch(toggleEventDrawerThunk()),
    //     icon: 'tweens',
    //     isActive: eventDrawerOpen,
    //     checkbox: true
    //   }]} />
  );
}

export default InsertButton;