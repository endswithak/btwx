import React, { useContext, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { setEventDrawerEventSort } from '../store/actions/eventDrawer';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface HeaderItemProps {
  isActive?: boolean;
  isDisabled?: boolean;
}

const HeaderItem = styled.button<HeaderItemProps>`
  color: ${props => props.isActive ? props.theme.palette.primary : props.theme.text.lighter};
  font-weight: 700;
  cursor:  ${props => props.isDisabled ? 'default' : 'pointer'};
  :hover {
    color: ${props => props.isActive && !props.isDisabled ? props.theme.palette.primaryHover : props.isDisabled ? props.theme.text.lighter : props.theme.text.base};
  }
`;

const EventDrawerListHeader = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const eventSort = useSelector((state: RootState) => state.eventDrawer.eventSort);
  const sortOrder = eventSort !== 'none' ? eventSort.substring(eventSort.length, eventSort.length - 3) as 'asc' | 'dsc' : null;
  const sortBy = eventSort !== 'none' ? ((): 'layer' | 'event' | 'artboard' | 'destinationArtboard' => {
    const hyphenIndex = eventSort.indexOf('-');
    return eventSort.substring(0, hyphenIndex) as 'layer' | 'event' | 'artboard' | 'destinationArtboard';
  })() : null;
  const dispatch = useDispatch();

  const handleSort = (by: 'layer' | 'event' | 'artboard' | 'destinationArtboard'): void => {
    if (sortOrder) {
      if (sortBy === by) {
        switch(sortOrder) {
          case 'asc':
            dispatch(setEventDrawerEventSort({eventSort: `${by}-dsc` as Btwx.TweenEventSort}));
            break;
          case 'dsc':
            dispatch(setEventDrawerEventSort({eventSort: 'none'}));
            break;
        }
      } else {
        dispatch(setEventDrawerEventSort({eventSort: `${by}-asc` as Btwx.TweenEventSort}));
      }
    } else {
      dispatch(setEventDrawerEventSort({eventSort: `${by}-asc` as Btwx.TweenEventSort}));
    }
  }

  return (
    <div
      className='c-event-drawer-list__header'
      style={{
        background: theme.name === 'dark'
        ? theme.background.z3
        : theme.background.z0,
        boxShadow: `0 -1px 0 0 ${theme.name === 'dark'
        ? theme.background.z4
        : theme.background.z5} inset`
      }}>
      <div className='c-event-drawer-list__item c-event-drawer-list__item--labels'>
        <HeaderItem
          theme={theme}
          className='c-event-drawer-list-item__module c-event-drawer-list-item__module--label'
          onClick={(): void => handleSort('layer')}
          isActive={eventSort === 'layer-asc' || eventSort === 'layer-dsc'}>
          layer
          {
            eventSort === 'layer-asc' || eventSort === 'layer-dsc'
            ? <Icon
                name={`sort-alpha-${sortOrder}`}
                style={{
                  fill: theme.palette.primary
                }}
                size='small' />
            : null
          }
        </HeaderItem>
        <HeaderItem
          theme={theme}
          className='c-event-drawer-list-item__module c-event-drawer-list-item__module--label'
          onClick={(): void => handleSort('event')}
          isActive={eventSort === 'event-asc' || eventSort === 'event-dsc'}>
          event
          {
            eventSort === 'event-asc' || eventSort === 'event-dsc'
            ? <Icon
                name={`sort-alpha-${sortOrder}`}
                style={{
                  fill: theme.palette.primary
                }}
                size='small' />
            : null
          }
        </HeaderItem>
        <HeaderItem
          theme={theme}
          className='c-event-drawer-list-item__module c-event-drawer-list-item__module--label'
          onClick={(): void => handleSort('artboard')}
          isActive={eventSort === 'artboard-asc' || eventSort === 'artboard-dsc'}>
          artboard
          {
            eventSort === 'artboard-asc' || eventSort === 'artboard-dsc'
            ? <Icon
                name={`sort-alpha-${sortOrder}`}
                style={{
                  fill: theme.palette.primary
                }}
                size='small' />
            : null
          }
        </HeaderItem>
        <HeaderItem
          theme={theme}
          className='c-event-drawer-list-item__module c-event-drawer-list-item__module--label'
          onClick={(): void => handleSort('destinationArtboard')}
          isActive={eventSort === 'destinationArtboard-asc' || eventSort === 'destinationArtboard-dsc'}>
          destination
          {
            eventSort === 'destinationArtboard-asc' || eventSort === 'destinationArtboard-dsc'
            ? <Icon
                name={`sort-alpha-${sortOrder}`}
                style={{
                  fill: theme.palette.primary
                }}
                size='small' />
            : null
          }
        </HeaderItem>
        <HeaderItem
          theme={theme}
          className='c-event-drawer-list-item__module c-event-drawer-list-item__module--label'
          isDisabled>
          actions
        </HeaderItem>
      </div>
    </div>
  );
}

export default EventDrawerListHeader;