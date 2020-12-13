/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import { setTweenDrawerTweenHoverThunk } from '../store/actions/tweenDrawer';
import TimelineLeftHandle from './TimelineLeftHandle';
import TimelineRightHandle from './TimelineRightHandle';
import TimelineTweenHandle from './TimelineTweenHandle';

interface TweenDrawerEventLayerTweenTimelineProps {
  tweenId: string;
}

const TweenDrawerEventLayerTweenTimeline = (props: TweenDrawerEventLayerTweenTimelineProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId } = props;
  // const tweenHover = useSelector((state: RootState) => state.tweenDrawer.tweenHover);
  const tweenEditing = useSelector((state: RootState) => state.tweenDrawer.tweenEditing);
  const dispatch = useDispatch();

  const handleMouseEnter = (): void => {
    dispatch(setTweenDrawerTweenHoverThunk({id: tweenId}));
  }

  const handleMouseLeave = (): void => {
    dispatch(setTweenDrawerTweenHoverThunk({id: null}));
  }

  return (
    <div
      id={`${tweenId}-timeline`}
      className='c-tween-drawer-event-layer__tween-timeline'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        color: theme.text.lighter,
        zIndex: tweenId === tweenEditing
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

export default TweenDrawerEventLayerTweenTimeline;