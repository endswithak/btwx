import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import TweenDrawerEvents from './TweenDrawerEvents';
import TweenDrawerEvent from './TweenDrawerEvent';
import TweenDrawerDragHandle from './TweenDrawerDragHandle';
import SidebarEmptyState from './SidebarEmptyState';

interface TweenDrawerProps {
  ready?: boolean;
  tweenDrawerHeight?: number;
  isEmpty?: boolean;
  tweenEvent?: em.TweenEvent;
}

const TweenDrawer = (props: TweenDrawerProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { ready, tweenEvent, tweenDrawerHeight, isEmpty } = props;

  return (
    <>
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
          ? <SidebarEmptyState
              icon='tweens'
              text='Events'
              detail={<span>View and edit document events here.<br/> You can add events when you have <br/>two or more artboards.</span>} />
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
  );
}

const mapStateToProps = (state: RootState): {
  tweenDrawerHeight: number;
  tweenEvent: em.TweenEvent;
  isEmpty: boolean;
} => {
  const { layer, tweenDrawer, documentSettings } = state;
  const tweenEvent = layer.present.tweenEventById[tweenDrawer.event];
  const tweenDrawerHeight = documentSettings.tweenDrawerHeight;
  const isEmpty = layer.present.allTweenEventIds.length === 0;
  return { tweenEvent, tweenDrawerHeight, isEmpty };
};

export default connect(
  mapStateToProps
)(TweenDrawer);