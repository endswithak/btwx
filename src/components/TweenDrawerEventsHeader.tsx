import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import { setTweenDrawerEventSort } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventSortPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import Icon from './Icon';

interface TweenDrawerEventsHeaderProps {
  eventSort?: em.TweenEventSort;
  sortOrder?: 'asc' | 'dsc';
  sortBy?: 'layer' | 'event' | 'artboard' | 'destinationArtboard';
  setTweenDrawerEventSort?(payload: SetTweenDrawerEventSortPayload): TweenDrawerTypes;
}

const HeaderItem = styled.div`
  cursor: pointer;
  :hover {
    box-shadow: 0 1px 0 0 ${props => props.theme.palette.primary} inset;
  }
`;

const TweenDrawerEventsHeader = (props: TweenDrawerEventsHeaderProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { eventSort, setTweenDrawerEventSort, sortOrder, sortBy } = props;

  const handleSort = (by: 'layer' | 'event' | 'artboard' | 'destinationArtboard') => {
    if (sortOrder) {
      if (sortBy === by) {
        switch(sortOrder) {
          case 'asc':
            setTweenDrawerEventSort({eventSort: `${by}-dsc` as em.TweenEventSort});
            break;
          case 'dsc':
            setTweenDrawerEventSort({eventSort: 'none'});
            break;
        }
      } else {
        setTweenDrawerEventSort({eventSort: `${by}-asc` as em.TweenEventSort});
      }
    } else {
      setTweenDrawerEventSort({eventSort: `${by}-asc` as em.TweenEventSort});
    }
  }

  return (
    <div
      className='c-tween-drawer-events__header'
      style={{
        background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2
      }}>
      <div
        className='c-tween-drawer-events__item c-tween-drawer-events__item--labels'
        style={{
          color: theme.text.lighter
        }}>
        <HeaderItem
          theme={theme}
          className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'
          onClick={() => handleSort('layer')}>
          layer
          {
            eventSort === 'layer-asc' || eventSort === 'layer-dsc'
            ? <Icon
                name={`sort-alpha-${sortOrder}`}
                style={{
                  fill: theme.palette.primary
                }}
                small />
            : null
          }
        </HeaderItem>
        <HeaderItem
          theme={theme}
          className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'
          onClick={() => handleSort('event')}>
          event
          {
            eventSort === 'event-asc' || eventSort === 'event-dsc'
            ? <Icon
                name={`sort-alpha-${sortOrder}`}
                style={{
                  fill: theme.palette.primary
                }}
                small />
            : null
          }
        </HeaderItem>
        <HeaderItem
          theme={theme}
          className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'
          onClick={() => handleSort('artboard')}>
          artboard
          {
            eventSort === 'artboard-asc' || eventSort === 'artboard-dsc'
            ? <Icon
                name={`sort-alpha-${sortOrder}`}
                style={{
                  fill: theme.palette.primary
                }}
                small />
            : null
          }
        </HeaderItem>
        <HeaderItem
          theme={theme}
          className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'
          onClick={() => handleSort('destinationArtboard')}>
          destination
          {
            eventSort === 'destinationArtboard-asc' || eventSort === 'destinationArtboard-dsc'
            ? <Icon
                name={`sort-alpha-${sortOrder}`}
                style={{
                  fill: theme.palette.primary
                }}
                small />
            : null
          }
        </HeaderItem>
        <div
          className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'>
          actions
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState): {
  eventSort: em.TweenEventSort;
  sortOrder: 'asc' | 'dsc';
  sortBy: 'layer' | 'event' | 'artboard' | 'destinationArtboard';
} => {
  const { tweenDrawer } = state;
  const eventSort = tweenDrawer.eventSort;
  const sortOrder = eventSort !== 'none' ? eventSort.substring(eventSort.length, eventSort.length - 3) as 'asc' | 'dsc' : null;
  const sortBy = eventSort !== 'none' ? (() => {
    const hyphenIndex = eventSort.indexOf('-');
    return eventSort.substring(0, hyphenIndex);
  })() as 'layer' | 'event' | 'artboard' | 'destinationArtboard' : null;
  return { eventSort, sortOrder, sortBy };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerEventSort }
)(TweenDrawerEventsHeader);