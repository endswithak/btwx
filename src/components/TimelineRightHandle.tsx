/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
import { setLayerTweenDuration } from '../store/actions/layer';

gsap.registerPlugin(Draggable);

interface TimelineRightHandleProps {
  tweenId: string;
}

const TimelineRightHandle = (props: TimelineRightHandleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId } = props;
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
  const [prevDuration, setPrevDuration] = useState(tween.duration);
  const [prevDelay, setPrevDelay] = useState(tween.delay);
  const [prevId, setPrevId] = useState(tweenId);
  const dispatch = useDispatch();

  const setupHandle = () => {
    const rightHandleInitialPos = ((tween.delay * 100) * theme.unit) + ((tween.duration * 100) * theme.unit) - theme.unit * 4;
    const leftHandleInitialPos = ((tween.delay * 100) * theme.unit);
    const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
    if (Draggable.get(rightHandleElement)) {
      Draggable.get(rightHandleElement).kill();
    }
    const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
    const timelineElement = document.getElementById(`${tweenId}-timeline`);
    const rightTooltipElement = document.getElementById(`${tweenId}-tooltip-right`);
    const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
    gsap.set(rightHandleElement, {x: rightHandleInitialPos});
    Draggable.create(rightHandleElement, {
      type: 'x',
      zIndexBoost: false,
      cursor: 'ew-resize',
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
        dispatch(setEventDrawerTweenEditing({id: tweenId}));
        gsap.set(rightTooltipElement, {display: 'inline'});
        rightTooltipElement.innerHTML = `${(tweenHandleElement.clientWidth / 4) / 100}s`;
        document.body.style.cursor = 'ew-resize';
      },
      onRelease: function() {
        dispatch(setEventDrawerTweenEditing({id: null}));
        gsap.set(rightTooltipElement, {display: 'none'});
        document.body.style.cursor = 'auto';
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
        dispatch(setLayerTweenDuration({id: tweenId, duration }));
      }
    });
  }

  // initial render
  useEffect(() => {
    setupHandle();
    return (): void => {
      const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
      if (Draggable.get(rightHandleElement)) {
        Draggable.get(rightHandleElement).kill();
      }
    }
  }, []);

  // updates bounds when delay or duration changes outside handles scope (ease editor)
  useEffect(() => {
    if (prevDuration !== tween.duration || prevDelay !== tween.delay) {
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
      setPrevDelay(tween.delay);
    }
  }, [tween.duration, tween.delay]);

  // updates handle when id changes (due to sorting)
  useEffect(() => {
    if (prevId !== tweenId) {
      setupHandle();
      setPrevId(tweenId);
    }
  }, [tweenId]);

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
      <div
        className='c-timeline-handle__guide'
        style={{
          background: theme.palette.recording,
          right: 0
        }} />
    </div>
  );
}

export default TimelineRightHandle;