/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getPrettyAccelerator } from '../utils';
import { toggleLeftSidebarThunk, toggleRightSidebarThunk, toggleEventDrawerThunk } from '../store/actions/viewSettings';
import ToggleListItem from './ToggleListItem';
import StackedButton from './StackedButton';
import Icon from './Icon';

const InsertButton = (): ReactElement => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const leftSidebarAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.view.showLayers));
  const leftSidebarOpenValue = useSelector((state: RootState) => state.viewSettings.leftSidebar.isOpen);
  const rightSidebarAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.view.showStyles));
  const rightSidebarOpenValue = useSelector((state: RootState) => state.viewSettings.rightSidebar.isOpen);
  const eventsAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.view.showEvents));
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

  const onKeyDown = (e: any): void => {
    if (e.key === 'Escape') {
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
    document.removeEventListener('keydown', onKeyDown);
  }

  const openDropdown = (): void => {
    setShowDropdown(true);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
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
                  { leftSidebarAccelerator }
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
                  { rightSidebarAccelerator }
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
                  { eventsAccelerator }
                </ToggleListItem.Text>
              </ToggleListItem.Right>
            </ToggleListItem>
          </div>
        : null
      }
    </div>
  );
}

export default InsertButton;