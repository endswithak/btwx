/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setTweenDrawerTweenEditing } from '../store/actions/tweenDrawer';
import { SetTweenDrawerTweenEditingPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { SetLayerTweenDurationPayload, SetLayerTweenDelayPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerTweenDuration, setLayerTweenDelay } from '../store/actions/layer';

gsap.registerPlugin(Draggable);

interface TimelineRightHandleProps {
  tweenId: string;
  tween?: em.Tween;
  setLayerTweenDuration?(payload: SetLayerTweenDurationPayload): LayerTypes;
  setLayerTweenDelay?(payload: SetLayerTweenDelayPayload): LayerTypes;
  setTweenDrawerTweenEditing?(payload: SetTweenDrawerTweenEditingPayload): TweenDrawerTypes;
}

const TimelineRightHandle = (props: TimelineRightHandleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, tween, setLayerTweenDuration, setTweenDrawerTweenEditing } = props;
  const [prevDuration, setPrevDuration] = useState(tween.duration);

  useEffect(() => {
    const rightHandleInitialPos = ((tween.delay * 100) * theme.unit) + ((tween.duration * 100) * theme.unit) - theme.unit * 4;
    const leftHandleInitialPos = ((tween.delay * 100) * theme.unit);
    const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
    const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
    const timelineElement = document.getElementById(`${tweenId}-timeline`);
    const rightTooltipElement = document.getElementById(`${tweenId}-tooltip-right`);
    const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
    gsap.set(rightHandleElement, {x: rightHandleInitialPos});
    Draggable.create(rightHandleElement, {
      type: 'x',
      zIndexBoost: false,
      autoScroll: 1,
      bounds: {
        minX: Draggable.get(leftHandleElement) ? Draggable.get(leftHandleElement).x : leftHandleInitialPos,
        maxX: timelineElement.clientWidth - (theme.unit * 4),
        minY: timelineElement.clientHeight,
        maxY: timelineElement.clientHeight
      },
      liveSnap: {
        x: function(value): number {
          return Math.round(value / theme.unit) * theme.unit;
        }
      },
      onPress: function() {
        setTweenDrawerTweenEditing({id: tweenId});
        gsap.set(rightTooltipElement, {display: 'inline'});
        rightTooltipElement.innerHTML = `${(tweenHandleElement.clientWidth / 4) / 100}s`;
      },
      onRelease: function() {
        setTweenDrawerTweenEditing({id: null});
        gsap.set(rightTooltipElement, {display: 'none'});
      },
      onDrag: function() {
        gsap.set(tweenHandleElement, {width: `+=${this.deltaX}`});
        rightTooltipElement.innerHTML = `${(tweenHandleElement.clientWidth / 4) / 100}s`;
      },
      onDragEnd: function() {
        Draggable.get(tweenHandleElement).update().applyBounds({
          minX: 0,
          maxX: timelineElement.clientWidth - tweenHandleElement.clientWidth,
          minY: timelineElement.clientHeight,
          maxY: timelineElement.clientHeight
        });
        Draggable.get(leftHandleElement).update().applyBounds({
          minX: 0,
          maxX: this.x,
          minY: timelineElement.clientHeight,
          maxY: timelineElement.clientHeight
        });
        const leftHandlePos = Draggable.get(leftHandleElement).x;
        const duration = (((this.x + theme.unit * 4) - leftHandlePos) / 4) / 100;
        setPrevDuration(duration);
        setLayerTweenDuration({id: tweenId, duration });
      }
    });
    return (): void => {
      const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
      if (Draggable.get(rightHandleElement)) {
        Draggable.get(rightHandleElement).kill();
      }
    }
  }, []);

  useEffect(() => {
    if (prevDuration !== tween.duration) {
      const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
      const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
      const timelineElement = document.getElementById(`${tweenId}-timeline`);
      const rightHandlePos = ((tween.delay * 100) * theme.unit) + ((tween.duration * 100) * theme.unit) - theme.unit * 4;
      gsap.set(rightHandleElement, {x: rightHandlePos});
      Draggable.get(rightHandleElement).update();
      Draggable.get(leftHandleElement).update().applyBounds({
        minX: 0,
        maxX: Draggable.get(rightHandleElement).x,
        minY: timelineElement.clientHeight,
        maxY: timelineElement.clientHeight
      });
      setPrevDuration(tween.duration);
    }
  }, [tween.duration]);

  return (
    <div
      id={`${tweenId}-handle-right`}
      className='c-timeline-handle c-timeline-handle--right'>
      <div
        className='c-timeline-handle__ellipse'
        style={{
          background: theme.text.onPrimary
        }} />
      <span
        id={`${tweenId}-tooltip-right`}
        className='c-timeline-handle__tooltip'
        style={{
          background: theme.name === 'dark' ? theme.background.z6 : theme.background.z0,
          color: theme.text.base,
          boxShadow: `0 1px 4px 0 rgba(0,0,0,0.25)`
        }} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TimelineRightHandleProps): {
  tween: em.Tween;
} => {
  const { layer } = state;
  const tween = layer.present.tweenById[ownProps.tweenId];
  return { tween };
};

export default connect(
  mapStateToProps,
  { setLayerTweenDuration, setLayerTweenDelay, setTweenDrawerTweenEditing }
)(TimelineRightHandle);