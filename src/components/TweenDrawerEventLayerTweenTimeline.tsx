/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ThemeContext } from './ThemeProvider';
import { setTweenDrawerTweenHover, setTweenDrawerTweenEditing } from '../store/actions/tweenDrawer';
import { SetTweenDrawerTweenHoverPayload, SetTweenDrawerTweenEditingPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import TimelineLeftHandle from './TimelineLeftHandle';
import TimelineRightHandle from './TimelineRightHandle';
import TimelineTweenHandle from './TimelineTweenHandle';

gsap.registerPlugin(Draggable);

interface TweenDrawerEventLayerTweenTimelineProps {
  tweenId: string;
  tweenHover?: string;
  tweenEditing?: string;
  setTweenDrawerTweenHover?(payload: SetTweenDrawerTweenHoverPayload): TweenDrawerTypes;
  setTweenDrawerTweenEditing?(payload: SetTweenDrawerTweenEditingPayload): TweenDrawerTypes;
}

const TweenDrawerEventLayerTweenTimeline = (props: TweenDrawerEventLayerTweenTimelineProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, tweenHover, tweenEditing, setTweenDrawerTweenHover } = props;

  // useEffect(() => {
  //   if (Draggable.get(tweenRef.current)) {
  //     Draggable.get(tweenRef.current).update().applyBounds({ minX: 0, maxX: timelineRef.current.clientWidth, minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight });
  //   }
  //   if (Draggable.get(leftHandleRef.current)) {
  //     const rightHandleInitialPos = ((tween.delay * 100) * theme.unit) + ((tween.duration * 100) * theme.unit) - theme.unit * 4;
  //     Draggable.get(leftHandleRef.current).update().applyBounds({ minX: 0, maxX: Draggable.get(rightHandleRef.current) ? Draggable.get(rightHandleRef.current).x : rightHandleInitialPos, minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight });
  //   }
  //   if (Draggable.get(rightHandleRef.current)) {
  //     const leftHandleInitialPos = ((tween.delay * 100) * theme.unit);
  //     Draggable.get(rightHandleRef.current).update().applyBounds({ minX: Draggable.get(leftHandleRef.current) ? Draggable.get(leftHandleRef.current).x : leftHandleInitialPos, maxX: timelineRef.current.clientWidth - (theme.unit * 4), minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight });
  //   }
  // }, [leftSidebarWidth]);

  const handleMouseEnter = () => {
    setTweenDrawerTweenHover({id: tweenId});
  }

  const handleMouseLeave = () => {
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

export default connect(
  null,
  { setTweenDrawerTweenHover, setTweenDrawerTweenEditing }
)(TweenDrawerEventLayerTweenTimeline);