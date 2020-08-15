/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setTweenDrawerTweenEditing } from '../store/actions/tweenDrawer';
import { SetTweenDrawerTweenEditingPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { SetLayerTweenTimingPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerTweenTiming } from '../store/actions/layer';

gsap.registerPlugin(Draggable);

interface TimelineLeftHandleProps {
  tweenId: string;
  tween?: em.Tween;
  setLayerTweenTiming?(payload: SetLayerTweenTimingPayload): LayerTypes;
  setTweenDrawerTweenEditing?(payload: SetTweenDrawerTweenEditingPayload): TweenDrawerTypes;
}

const TimelineLeftHandle = (props: TimelineLeftHandleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, tween, setLayerTweenTiming, setTweenDrawerTweenEditing } = props;
  const [prevDelay, setPrevDelay] = useState(tween.delay);
  const [prevId, setPrevId] = useState(tweenId);

  const setupHandle = () => {
    const rightHandleInitialPos = ((tween.delay * 100) * theme.unit) + ((tween.duration * 100) * theme.unit) - theme.unit * 4;
    const leftHandleInitialPos = ((tween.delay * 100) * theme.unit);
    const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
    if (Draggable.get(leftHandleElement)) {
      Draggable.get(leftHandleElement).kill();
    }
    const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
    const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
    const timelineElement = document.getElementById(`${tweenId}-timeline`);
    const leftTooltipElement = document.getElementById(`${tweenId}-tooltip-left`);
    gsap.set(leftHandleElement, {x: leftHandleInitialPos});
    Draggable.create(leftHandleElement, {
      type: 'x',
      zIndexBoost: false,
      cursor: 'ew-resize',
      autoScroll: 1,
      bounds: {
        minX: 0,
        maxX: Draggable.get(rightHandleElement) ? Draggable.get(rightHandleElement).x : rightHandleInitialPos,
        minY: timelineElement.clientHeight,
        maxY: timelineElement.clientHeight
      },
      minX: theme.unit,
      liveSnap: {
        x: function(value): number {
          return Math.round(value / theme.unit) * theme.unit;
        }
      },
      onPress: function() {
        setTweenDrawerTweenEditing({id: tweenId});
        gsap.set(leftTooltipElement, {display: 'inline'});
        leftTooltipElement.innerHTML = `${(this.x / 4) / 100}s`;
      },
      onRelease: function() {
        setTweenDrawerTweenEditing({id: null});
        gsap.set(leftTooltipElement, {display: 'none'});
      },
      onDrag: function() {
        gsap.set(tweenHandleElement, {x: `+=${this.deltaX}`, width: `-=${this.deltaX}`});
        leftTooltipElement.innerHTML = `${(this.x / 4) / 100}s`;
      },
      onDragEnd: function() {
        Draggable.get(tweenHandleElement).update().applyBounds({
          minX: 0,
          maxX: timelineElement.clientWidth - tweenHandleElement.clientWidth,
          minY: timelineElement.clientHeight,
          maxY: timelineElement.clientHeight
        });
        Draggable.get(rightHandleElement).update().applyBounds({
          minX: this.x,
          maxX: timelineElement.clientWidth - (theme.unit * 4),
          minY: timelineElement.clientHeight,
          maxY: timelineElement.clientHeight
        });
        const rightHandlePos = Draggable.get(rightHandleElement).x;
        const duration = (((rightHandlePos + theme.unit * 4) - this.x) / 4) / 100;
        const delay = (this.x / 4) / 100;
        setPrevDelay(delay);
        setLayerTweenTiming({id: tweenId, duration, delay});
      }
    });
  }

  // initial render
  useEffect(() => {
    setupHandle();
    return (): void => {
      const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
      if (Draggable.get(leftHandleElement)) {
        Draggable.get(leftHandleElement).kill();
      }
    }
  }, []);

  // updates bounds when delay changes outside handles scope (ease editor)
  useEffect(() => {
    if (prevDelay !== tween.delay) {
      const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
      const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
      const timelineElement = document.getElementById(`${tweenId}-timeline`);
      const leftHandlePos = ((tween.delay * 100) * theme.unit);
      gsap.set(leftHandleElement, {x: leftHandlePos});
      Draggable.get(leftHandleElement).update();
      Draggable.get(rightHandleElement).update().applyBounds({
        minX: Draggable.get(leftHandleElement).x,
        maxX: timelineElement.clientWidth - (theme.unit * 4),
        minY: timelineElement.clientHeight,
        maxY: timelineElement.clientHeight
      });
      setPrevDelay(tween.delay);
    }
  }, [tween.delay]);

  // updates handle when id changes (due to sorting)
  useEffect(() => {
    if (prevId !== tweenId) {
      setupHandle();
      setPrevId(tweenId);
    }
  }, [tweenId]);

  return (
    <div
      id={`${tweenId}-handle-left`}
      className='c-timeline-handle c-timeline-handle--left'>
      <div
        className='c-timeline-handle__ellipse'
        style={{
          background: theme.text.onPrimary
        }} />
      <span
        id={`${tweenId}-tooltip-left`}
        className='c-timeline-handle__tooltip'
        style={{
          background: theme.name === 'dark' ? theme.background.z6 : theme.background.z0,
          color: theme.text.base,
          boxShadow: `0 1px 4px 0 rgba(0,0,0,0.25)`
        }} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TimelineLeftHandleProps): {
  tween: em.Tween;
} => {
  const { layer } = state;
  const tween = layer.present.tweenById[ownProps.tweenId];
  return { tween };
};

export default connect(
  mapStateToProps,
  { setLayerTweenTiming, setTweenDrawerTweenEditing }
)(TimelineLeftHandle);