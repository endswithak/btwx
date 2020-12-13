import React, { useContext, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEvents from './TweenDrawerEvents';
import TweenDrawerEvent from './TweenDrawerEvent';
import TweenDrawerDragHandle from './TweenDrawerDragHandle';
import EmptyState from './EmptyState';

interface TweenDrawerProps {
  ready?: boolean;
}

const TweenDrawer = (props: TweenDrawerProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { ready } = props;
  const tweenEvent = useSelector((state: RootState) => state.layer.present.events.byId[state.tweenDrawer.event]);
  const tweenDrawerHeight = useSelector((state: RootState) => state.viewSettings.tweenDrawer.height);
  const isEmpty = useSelector((state: RootState) => state.layer.present.events.allIds.length === 0);
  const isOpen = useSelector((state: RootState) => state.viewSettings.tweenDrawer.isOpen);

  return (
    isOpen
    ? <>
        <TweenDrawerDragHandle />
        <div
          id='tween-drawer'
          className='c-tween-drawer'
          style={{
            height: tweenDrawerHeight,
            background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
            boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
          }}>
          {
            isEmpty
            ? <EmptyState
                icon='tweens'
                text='Events'
                detail='Events can be added when the document has two or more artboards.'
                style={{paddingLeft: 24, paddingRight: 24}} />
            : null
          }
          {
            ready
            ? tweenEvent
              ? <TweenDrawerEvent />
              : <TweenDrawerEvents />
            : null
          }
        </div>
      </>
    : null
  );
}

export default TweenDrawer;