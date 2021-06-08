import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEventDrawerEventSort } from '../store/actions/eventDrawer';
import Icon from './Icon';
import ListGroup from './ListGroup';
import ListItem from './ListItem';

const EventDrawerListHeader = (): ReactElement => {
  const eventSort = useSelector((state: RootState) => state.eventDrawer.eventSort);
  const sortOrder = eventSort !== 'none' ? eventSort.substring(eventSort.length, eventSort.length - 3) as 'asc' | 'dsc' : null;
  const sortBy = eventSort !== 'none' ? ((): Btwx.EventSortBy => {
    const hyphenIndex = eventSort.indexOf('-');
    return eventSort.substring(0, hyphenIndex) as Btwx.EventSortBy;
  })() : null;
  const dispatch = useDispatch();

  const handleSort = (by: Btwx.EventSortBy): void => {
    if (sortOrder) {
      if (sortBy === by) {
        switch(sortOrder) {
          case 'asc':
            dispatch(setEventDrawerEventSort({eventSort: `${by}-dsc` as Btwx.EventSort}));
            break;
          case 'dsc':
            dispatch(setEventDrawerEventSort({eventSort: 'none'}));
            break;
        }
      } else {
        dispatch(setEventDrawerEventSort({eventSort: `${by}-asc` as Btwx.EventSort}));
      }
    } else {
      dispatch(setEventDrawerEventSort({eventSort: `${by}-asc` as Btwx.EventSort}));
    }
  }

  const getSortLabel = (sort: string): string => {
    switch(sort) {
      case 'layer':
      case 'artboard':
        return sort;
      case 'event':
        return 'listener';
      case 'destinationArtboard':
        return 'destination';
      default:
        return sort;
    }
  }

  const items = (['layer', 'event', 'artboard', 'destinationArtboard'] as Btwx.EventSortBy[]).map((sort, index) => (
    <ListItem
      key={sort}
      onClick={(): void => handleSort(sort)}
      flush
      root
      style={{
        cursor: 'pointer'
      }}>
      {
        eventSort === `${sort}-asc` || eventSort === `${sort}-dsc`
        ? <Icon
            name={`sort-alpha-${sortOrder}`}
            variant='primary'
            size='small' />
        : null
      }
      <ListItem.Body>
        <ListItem.Text
          size='small'
          textStyle='cap'
          variant={
            eventSort === `${sort}-asc` || eventSort === `${sort}-dsc`
            ? 'primary'
            : 'lighter'
          }>
          { getSortLabel(sort) }
        </ListItem.Text>
      </ListItem.Body>
    </ListItem>
  ));

  return (
    <div className='c-event-drawer-list__header'>
      <ListGroup horizontal>
        { items }
      </ListGroup>
    </div>
  );
}

export default EventDrawerListHeader;