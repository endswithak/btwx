/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import { setTweenDrawerTweenHoverThunk, setTweenDrawerTweenEditing } from '../store/actions/tweenDrawer';
import { SetTweenDrawerTweenHoverPayload } from '../store/actionTypes/tweenDrawer';
import TimelineLeftHandle from './TimelineLeftHandle';
import TimelineRightHandle from './TimelineRightHandle';
import TimelineTweenHandle from './TimelineTweenHandle';

interface TweenDrawerEventLayerTweenTimelineProps {
  tweenId: string;
  tweenHover?: string;
  tweenEditing?: string;
  setTweenDrawerTweenHoverThunk?(payload: SetTweenDrawerTweenHoverPayload): void;
}

const TweenDrawerEventLayerTweenTimeline = (props: TweenDrawerEventLayerTweenTimelineProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, tweenHover, tweenEditing, setTweenDrawerTweenHoverThunk } = props;

  const handleMouseEnter = (): void => {
    setTweenDrawerTweenHoverThunk({id: tweenId});
  }

  const handleMouseLeave = (): void => {
    setTweenDrawerTweenHoverThunk({id: null});
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

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerTweenTimelineProps): {
  tweenHover: string;
  tweenEditing: string;
} => {
  const { tweenDrawer, layer } = state;
  const tweenHover = tweenDrawer.tweenHover;
  const tweenEditing = tweenDrawer.tweenEditing;
  return { tweenHover, tweenEditing };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerTweenHoverThunk, setTweenDrawerTweenEditing }
)(TweenDrawerEventLayerTweenTimeline);