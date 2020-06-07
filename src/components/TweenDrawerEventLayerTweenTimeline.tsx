/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setTweenDrawerTweenHover, setTweenDrawerTweenEditing } from '../store/actions/tweenDrawer';
import { SetTweenDrawerTweenHoverPayload, SetTweenDrawerTweenEditingPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { SetLayerTweenDurationPayload, SetLayerTweenDelayPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerTweenDuration, setLayerTweenDelay } from '../store/actions/layer';

gsap.registerPlugin(Draggable);

interface TweenDrawerEventLayerTweenTimelineProps {
  tweenId: string;
  tween?: em.Tween;
  tweenHover?: string;
  tweenEditing?: string;
  setLayerTweenDuration?(payload: SetLayerTweenDurationPayload): LayerTypes;
  setLayerTweenDelay?(payload: SetLayerTweenDelayPayload): LayerTypes;
  setTweenDrawerTweenHover?(payload: SetTweenDrawerTweenHoverPayload): TweenDrawerTypes;
  setTweenDrawerTweenEditing?(payload: SetTweenDrawerTweenEditingPayload): TweenDrawerTypes;
}

const TweenDrawerEventLayerTweenTimeline = (props: TweenDrawerEventLayerTweenTimelineProps): ReactElement => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<HTMLDivElement>(null);
  const leftHandleRef = useRef<HTMLDivElement>(null);
  const rightHandleRef = useRef<HTMLDivElement>(null);
  const rightHandleTooltipRef = useRef<HTMLSpanElement>(null);
  const leftHandleTooltipRef = useRef<HTMLSpanElement>(null);
  const theme = useContext(ThemeContext);
  const { tweenId, tween, tweenHover, tweenEditing, setLayerTweenDuration, setLayerTweenDelay, setTweenDrawerTweenHover, setTweenDrawerTweenEditing } = props;

  useEffect(() => {
    if (tweenRef.current) {
      const rightHandleInitialPos = ((tween.delay * 100) * theme.unit) + ((tween.duration * 100) * theme.unit) - theme.unit * 4;
      const leftHandleInitialPos = ((tween.delay * 100) * theme.unit);
      gsap.set(leftHandleRef.current, {x: leftHandleInitialPos});
      gsap.set(rightHandleRef.current, {x: rightHandleInitialPos});
      gsap.set(tweenRef.current, {x: (tween.delay * 100) * theme.unit, width: (tween.duration * 100) * theme.unit});
      Draggable.create(tweenRef.current, {
        type: 'x',
        zIndexBoost: false,
        bounds: { minX: 0, maxX: timelineRef.current.clientWidth, minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight },
        autoScroll: 1,
        liveSnap: {
          x: function(value) {
            return Math.round(value / theme.unit) * theme.unit;
          }
        },
        onPress: function() {
          setTweenDrawerTweenEditing({id: tweenId});
          gsap.set(leftHandleTooltipRef.current, {opacity: 1});
          leftHandleTooltipRef.current.innerHTML = `${(gsap.getProperty(leftHandleRef.current, 'x') as number / 4) / 100}s`;
        },
        onRelease: function() {
          setTweenDrawerTweenEditing({id: null});
          gsap.set(leftHandleTooltipRef.current, {opacity: 0});
        },
        onDrag: function() {
          gsap.set([leftHandleRef.current, rightHandleRef.current], {x: `+=${this.deltaX}`});
          leftHandleTooltipRef.current.innerHTML = `${(gsap.getProperty(leftHandleRef.current, 'x') as number / 4) / 100}s`;
        },
        onDragEnd: function() {
          const distance = this.endX - this.startX;
          Draggable.get(rightHandleRef.current).update().applyBounds({ minX: Draggable.get(leftHandleRef.current).x + distance, maxX: timelineRef.current.clientWidth - theme.unit, minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight });
          Draggable.get(leftHandleRef.current).update().applyBounds({ minX: 0, maxX: Draggable.get(rightHandleRef.current).x, minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight });
          const leftHandlePos = Draggable.get(leftHandleRef.current).x;
          const delay = (leftHandlePos / 4) / 100;
          setLayerTweenDelay({id: tweenId, delay });
        }
      });
      Draggable.create(leftHandleRef.current, {
        type: 'x',
        zIndexBoost: false,
        autoScroll: 1,
        bounds: { minX: 0, maxX: Draggable.get(rightHandleRef.current) ? Draggable.get(rightHandleRef.current).x : rightHandleInitialPos, minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight },
        minX: theme.unit,
        liveSnap: {
          x: function(value) {
            return Math.round(value / theme.unit) * theme.unit;
          }
        },
        onPress: function() {
          setTweenDrawerTweenEditing({id: tweenId});
          gsap.set(leftHandleTooltipRef.current, {opacity: 1});
          leftHandleTooltipRef.current.innerHTML = `${(this.x / 4) / 100}s`;
        },
        onRelease: function() {
          setTweenDrawerTweenEditing({id: null});
          gsap.set(leftHandleTooltipRef.current, {opacity: 0});
        },
        onDrag: function() {
          gsap.set(tweenRef.current, {x: `+=${this.deltaX}`, width: `-=${this.deltaX}`});
          leftHandleTooltipRef.current.innerHTML = `${(this.x / 4) / 100}s`;
        },
        onDragEnd: function() {
          Draggable.get(tweenRef.current).update();
          Draggable.get(rightHandleRef.current).update().applyBounds({ minX: this.x, maxX: timelineRef.current.clientWidth - theme.unit, minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight });
          const rightHandlePos = Draggable.get(rightHandleRef.current).x;
          const duration = (((rightHandlePos + theme.unit * 4) - this.x) / 4) / 100;
          const delay = (this.x / 4) / 100;
          setLayerTweenDuration({id: tweenId, duration });
          setLayerTweenDelay({id: tweenId, delay });
        }
      });
      Draggable.create(rightHandleRef.current, {
        type: 'x',
        zIndexBoost: false,
        autoScroll: 1,
        bounds: { minX: Draggable.get(leftHandleRef.current) ? Draggable.get(leftHandleRef.current).x : leftHandleInitialPos, maxX: timelineRef.current.clientWidth - (theme.unit * 4), minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight },
        liveSnap: {
          x: function(value) {
            return Math.round(value / theme.unit) * theme.unit;
          }
        },
        onPress: function() {
          setTweenDrawerTweenEditing({id: tweenId});
          gsap.set(rightHandleTooltipRef.current, {opacity: 1});
          rightHandleTooltipRef.current.innerHTML = `${(tweenRef.current.clientWidth / 4) / 100}s`;
        },
        onRelease: function() {
          setTweenDrawerTweenEditing({id: null});
          gsap.set(rightHandleTooltipRef.current, {opacity: 0});
        },
        onDrag: function() {
          gsap.set(tweenRef.current, {width: `+=${this.deltaX}`});
          rightHandleTooltipRef.current.innerHTML = `${(tweenRef.current.clientWidth / 4) / 100}s`;
        },
        onDragEnd: function() {
          Draggable.get(tweenRef.current).update();
          Draggable.get(leftHandleRef.current).update().applyBounds({ minX: 0, maxX: this.x, minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight });
          const leftHandlePos = Draggable.get(leftHandleRef.current).x;
          const duration = (((this.x + theme.unit * 4) - leftHandlePos) / 4) / 100;
          setLayerTweenDuration({id: tweenId, duration });
        }
      });
    }
  }, []);

  const handleMouseEnter = () => {
    setTweenDrawerTweenHover({id: tweenId});
  }

  const handleMouseLeave = () => {
    setTweenDrawerTweenHover({id: null});
  }

  return (
    <div
      ref={timelineRef}
      className={`c-tween-drawer-event-layer__tween-timeline`}
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
      <div
        ref={tweenRef}
        style={{
          height: theme.unit * 4,
          position: 'relative',
          background: tween.frozen
          ? theme.background.z6
          : theme.palette.primary
        }}>
      </div>
      <div
        ref={leftHandleRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          height: theme.unit * 4,
          width: theme.unit * 4
        }}>
        <div
          style={{
            height: theme.unit * 2,
            width: theme.unit * 2,
            background: theme.text.base
          }} />
        <span
          ref={leftHandleTooltipRef}
          style={{
            display: 'flex',
            position: 'absolute',
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            top: theme.unit * 5,
            background: theme.background.z4,
            color: theme.text.base,
            fontSize: 12,
            textAlign: 'center',
            height: theme.unit * 5,
            padding: `0 ${theme.unit}px`
          }} />
      </div>
      <div
        ref={rightHandleRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          height: theme.unit * 4,
          width: theme.unit * 4
        }}>
        <div
          style={{
            height: theme.unit * 2,
            width: theme.unit * 2,
            background: theme.text.base
          }} />
        <span
          ref={rightHandleTooltipRef}
          style={{
            display: 'flex',
            position: 'absolute',
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            top: theme.unit * 5,
            background: theme.background.z4,
            color: theme.text.base,
            fontSize: 12,
            textAlign: 'center',
            height: theme.unit * 5,
            padding: `0 ${theme.unit}px`
          }} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerTweenTimelineProps) => {
  const { layer, tweenDrawer } = state;
  const tween = layer.present.tweenById[ownProps.tweenId];
  const tweenHover = tweenDrawer.tweenHover;
  const tweenEditing = tweenDrawer.tweenEditing;
  return { tween, tweenHover, tweenEditing };
};

export default connect(
  mapStateToProps,
  { setLayerTweenDuration, setLayerTweenDelay, setTweenDrawerTweenHover, setTweenDrawerTweenEditing }
)(TweenDrawerEventLayerTweenTimeline);