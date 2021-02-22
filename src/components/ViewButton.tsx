/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleLeftSidebarThunk, toggleRightSidebarThunk, toggleEventDrawerThunk } from '../store/actions/viewSettings';
import ToggleListItem from './ToggleListItem';
import StackedButton from './StackedButton';
import Icon from './Icon';

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

  const isMac = remote.process.platform === 'darwin';

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

  useEffect(() => {
    if (leftSidebarOpenValue !== leftSidebarOpen) {
      setLeftSidebarOpen(leftSidebarOpenValue);
    }
  }, [leftSidebarOpenValue]);

  useEffect(() => {
    if (rightSidebarOpenValue !== rightSidebarOpen) {
      setRightSidebarOpen(rightSidebarOpenValue);
    }
  }, [rightSidebarOpenValue]);

  useEffect(() => {
    if (eventDrawerOpenValue !== eventDrawerOpen) {
      setEventDrawerOpen(eventDrawerOpenValue);
    }
  }, [eventDrawerOpenValue]);

  return (
    <div
      className='c-topbar-dropdown-button'
      ref={dropdownRef}>
      <StackedButton
        label='View'
        onClick={handleClick}
        size='small'
        isActive={showDropdown}>
        <Icon
          name='left-sidebar'
          size='small' />
      </StackedButton>
      {
        showDropdown
        ? <div className='c-topbar-dropdown-button__dropdown c-topbar-dropdown-button__dropdown--right'>
            <ToggleListItem
              name='layers'
              type='checkbox'
              onChange={handleLeftSidebarChange}
              value={leftSidebarOpen}
              checked={leftSidebarOpen}>
              <ToggleListItem.Icon name='left-sidebar' />
              <ToggleListItem.Body>
                <ToggleListItem.Text
                  size='small'>
                  Layers
                </ToggleListItem.Text>
              </ToggleListItem.Body>
              <ToggleListItem.Right>
                <ToggleListItem.Text
                  variant='lighter'
                  size='small'>
                  { isMac ? '⌥⌘1' : 'Alt+Ctrl+1' }
                </ToggleListItem.Text>
              </ToggleListItem.Right>
            </ToggleListItem>
            <ToggleListItem
              name='styles'
              type='checkbox'
              onChange={handleRightSidebarChange}
              value={rightSidebarOpen}
              checked={rightSidebarOpen}>
              <ToggleListItem.Icon name='right-sidebar' />
              <ToggleListItem.Body>
                <ToggleListItem.Text
                  size='small'>
                  Styles
                </ToggleListItem.Text>
              </ToggleListItem.Body>
              <ToggleListItem.Right>
                <ToggleListItem.Text
                  variant='lighter'
                  size='small'>
                  { isMac ? '⌥⌘2' : 'Alt+Ctrl+2' }
                </ToggleListItem.Text>
              </ToggleListItem.Right>
            </ToggleListItem>
            <ToggleListItem
              name='events'
              type='checkbox'
              onChange={handleEventsChange}
              value={eventDrawerOpen}
              checked={eventDrawerOpen}>
              <ToggleListItem.Icon name='tweens' />
              <ToggleListItem.Body>
                <ToggleListItem.Text
                  size='small'>
                  Events
                </ToggleListItem.Text>
              </ToggleListItem.Body>
              <ToggleListItem.Right>
                <ToggleListItem.Text
                  variant='lighter'
                  size='small'>
                  { isMac ? '⌥⌘3' : 'Alt+Ctrl+3' }
                </ToggleListItem.Text>
              </ToggleListItem.Right>
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