import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEventDrawerEventSort } from '../store/actions/eventDrawer';
import Icon from './Icon';
import Text from './Text';
import ListGroup from './ListGroup';
import ListItem from './ListItem';

const EventDrawerListHeader = (): ReactElement => {
  const eventSort = useSelector((state: RootState) => state.eventDrawer.eventSort);
  const sortOrder = eventSort !== 'none' ? eventSort.substring(eventSort.length, eventSort.length - 3) as 'asc' | 'dsc' : null;
  const sortBy = eventSort !== 'none' ? ((): Btwx.TweenEventSortBy => {
    const hyphenIndex = eventSort.indexOf('-');
    return eventSort.substring(0, hyphenIndex) as Btwx.TweenEventSortBy;
  })() : null;
  const dispatch = useDispatch();

  const handleSort = (by: Btwx.TweenEventSortBy): void => {
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

  const items = (['layer', 'event', 'artboard', 'destinationArtboard'] as Btwx.TweenEventSortBy[]).map((sort, index) => (
    <ListItem
      key={sort}
      onClick={(): void => handleSort(sort)}
      flush
      root>
      {
        eventSort === `${sort}-asc` || eventSort === `${sort}-dsc`
        ? <Icon
            name={`sort-alpha-${sortOrder}`}
            variant='primary'
            size='small'
            style={{
              marginLeft: 4
            }} />
        : null
      }
      <ListItem.Body>
        <Text
          textStyle='cap'
          size='small'
          variant={
            eventSort === `${sort}-asc` || eventSort === `${sort}-dsc`
            ? 'primary'
            : null
          }>
          {
            (() => {
              switch(sort) {
                case 'destinationArtboard':
                  return 'Destination';
                default:
                  return sort;
              }
            })()
          }
        </Text>
      </ListItem.Body>
    </ListItem>
  ));

  return (
    <div className='c-event-drawer-list__header'>
      <ListGroup horizontal>
        { items }
        <ListGroup.Item
          flush
          root>
          <Text
            textStyle='cap'
            size='small'>
            Actions
          </Text>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default EventDrawerListHeader;