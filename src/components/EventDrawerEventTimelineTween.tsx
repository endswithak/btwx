/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEventDrawerTweenHoverThunk } from '../store/actions/eventDrawer';
import { ThemeContext } from './ThemeProvider';
import TimelineLeftHandle from './TimelineLeftHandle';
import TimelineRightHandle from './TimelineRightHandle';
import TimelineTweenHandle from './TimelineTweenHandle';

interface EventDrawerEventTimelineTweenProps {
  tweenId: string;
}

const EventDrawerEventTimelineTween = (props: EventDrawerEventTimelineTweenProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId } = props;
  // const tweenHover = useSelector((state: RootState) => state.eventDrawer.tweenHover);
  const editing = useSelector((state: RootState) => state.eventDrawer.tweenEditing === tweenId);
  const dispatch = useDispatch();

  const handleMouseEnter = (): void => {
    dispatch(setEventDrawerTweenHoverThunk({id: tweenId}));
  }

  const handleMouseLeave = (): void => {
    dispatch(setEventDrawerTweenHoverThunk({id: null}));
  }

  return (
    <div
      id={`${tweenId}-timeline`}
      className='c-event-drawer-event-layer__tween-timeline'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        color: theme.text.lighter,
        zIndex: editing
        ? 3
        : 'inherit'
      }}>
      <TimelineTweenHandle
        tweenId={tweenId} />
      <TimelineLeftHandle
        tweenId={tweenId} />
      <TimelineRightHandle
        tweenId={tweenId} />
    </div>
  );
}

export default EventDrawerEventTimelineTween;