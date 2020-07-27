/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import gsap from 'gsap';
import { RootState } from '../store/reducers';
import { Draggable } from 'gsap/Draggable';
import { ThemeContext } from './ThemeProvider';
import { setTweenDrawerTweenHover, setTweenDrawerTweenEditing } from '../store/actions/tweenDrawer';
import { SetTweenDrawerTweenHoverPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import TimelineLeftHandle from './TimelineLeftHandle';
import TimelineRightHandle from './TimelineRightHandle';
import TimelineTweenHandle from './TimelineTweenHandle';

gsap.registerPlugin(Draggable);

interface TweenDrawerEventLayerTweenTimelineProps {
  tweenId: string;
  tweenHover?: string;
  tweenEditing?: string;
  setTweenDrawerTweenHover?(payload: SetTweenDrawerTweenHoverPayload): TweenDrawerTypes;
}

const TweenDrawerEventLayerTweenTimeline = (props: TweenDrawerEventLayerTweenTimelineProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, tweenHover, tweenEditing, setTweenDrawerTweenHover } = props;

  const handleMouseEnter = (): void => {
    setTweenDrawerTweenHover({id: tweenId});
  }

  const handleMouseLeave = (): void => {
    setTweenDrawerTweenHover({id: null});
  }

  return (
    <div
      id={`${tweenId}-timeline`}
      className='c-tween-drawer-event-layer__tween-timeline'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        color: theme.text.lighter,
        background: tweenId === tweenHover && !tweenEditing || tweenId === tweenEditing
        ? theme.background.z3
        : 'none',
        zIndex: tweenId === tweenEditing || tweenId === tweenHover
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

const mapStateToProps = (state: RootState): {
  tweenHover: string;
  tweenEditing: string;
} => {
  const { tweenDrawer } = state;
  const tweenHover = tweenDrawer.tweenHover;
  const tweenEditing = tweenDrawer.tweenEditing;
  return { tweenHover, tweenEditing };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerTweenHover, setTweenDrawerTweenEditing }
)(TweenDrawerEventLayerTweenTimeline);