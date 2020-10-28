import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import { setTweenDrawerEventSort } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventSortPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import Icon from './Icon';

interface TweenDrawerEventsHeaderProps {
  eventSort?: Btwx.TweenEventSort;
  sortOrder?: 'asc' | 'dsc';
  sortBy?: 'layer' | 'event' | 'artboard' | 'destinationArtboard';
  setTweenDrawerEventSort?(payload: SetTweenDrawerEventSortPayload): TweenDrawerTypes;
}

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

const TweenDrawerEventsHeader = (props: TweenDrawerEventsHeaderProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { eventSort, setTweenDrawerEventSort, sortOrder, sortBy } = props;

  const handleSort = (by: 'layer' | 'event' | 'artboard' | 'destinationArtboard'): void => {
    if (sortOrder) {
      if (sortBy === by) {
        switch(sortOrder) {
          case 'asc':
            setTweenDrawerEventSort({eventSort: `${by}-dsc` as Btwx.TweenEventSort});
            break;
          case 'dsc':
            setTweenDrawerEventSort({eventSort: 'none'});
            break;
        }
      } else {
        setTweenDrawerEventSort({eventSort: `${by}-asc` as Btwx.TweenEventSort});
      }
    } else {
      setTweenDrawerEventSort({eventSort: `${by}-asc` as Btwx.TweenEventSort});
    }
  }

  return (
    <div
      className='c-tween-drawer-events__header'
      style={{
        background: theme.name === 'dark' ? theme.background.z3 : theme.background.z0,
        boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
      }}>
      <div className='c-tween-drawer-events__item c-tween-drawer-events__item--labels'>
        <HeaderItem
          theme={theme}
          className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'
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
                small />
            : null
          }
        </HeaderItem>
        <HeaderItem
          theme={theme}
          className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'
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
                small />
            : null
          }
        </HeaderItem>
        <HeaderItem
          theme={theme}
          className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'
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
                small />
            : null
          }
        </HeaderItem>
        <HeaderItem
          theme={theme}
          className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'
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
                small />
            : null
          }
        </HeaderItem>
        <HeaderItem
          theme={theme}
          className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'
          isDisabled>
          actions
        </HeaderItem>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState): {
  eventSort: Btwx.TweenEventSort;
  sortOrder: 'asc' | 'dsc';
  sortBy: 'layer' | 'event' | 'artboard' | 'destinationArtboard';
} => {
  const { tweenDrawer } = state;
  const eventSort = tweenDrawer.eventSort;
  const sortOrder = eventSort !== 'none' ? eventSort.substring(eventSort.length, eventSort.length - 3) as 'asc' | 'dsc' : null;
  const sortBy = eventSort !== 'none' ? ((): 'layer' | 'event' | 'artboard' | 'destinationArtboard' => {
    const hyphenIndex = eventSort.indexOf('-');
    return eventSort.substring(0, hyphenIndex) as 'layer' | 'event' | 'artboard' | 'destinationArtboard';
  })() : null;
  return { eventSort, sortOrder, sortBy };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerEventSort }
)(TweenDrawerEventsHeader);