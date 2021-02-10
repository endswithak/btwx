/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { RootState } from '../store/reducers';
import { setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
import { setLayerTweenDuration } from '../store/actions/layer';

gsap.registerPlugin(Draggable);

interface TimelineRightHandleProps {
  tweenId: string;
}

const TimelineRightHandle = (props: TimelineRightHandleProps): ReactElement => {
  const themeUnit = 4;
  const { tweenId } = props;
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
  const [prevDuration, setPrevDuration] = useState(tween.duration);
  const [prevDelay, setPrevDelay] = useState(tween.delay);
  const [prevId, setPrevId] = useState(tweenId);
  const dispatch = useDispatch();

  const setupHandle = (): void => {
    const rightHandleInitialPos = ((tween.delay * 100) * themeUnit) + ((tween.duration * 100) * themeUnit) - themeUnit * 4;
    const leftHandleInitialPos = ((tween.delay * 100) * themeUnit);
    const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
    if (Draggable.get(rightHandleElement)) {
      Draggable.get(rightHandleElement).kill();
    }
    const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
    const timelineElement = document.getElementById(`${tweenId}-timeline`);
    const rightTooltipElement = document.getElementById(`${tweenId}-tooltip-right`);
    const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
    const guide = document.getElementById('event-drawer-guide');
    gsap.set(rightHandleElement, {x: rightHandleInitialPos});
    Draggable.create(rightHandleElement, {
      type: 'x',
      zIndexBoost: false,
      cursor: 'ew-resize',
      autoScroll: 1,
      bounds: {
        minX: Draggable.get(leftHandleElement) ? Draggable.get(leftHandleElement).x : leftHandleInitialPos,
        maxX: timelineElement.clientWidth - (themeUnit * 4),
        minY: timelineElement.clientHeight,
        maxY: timelineElement.clientHeight
      },
      liveSnap: {
        x: function(value): number {
          return Math.round(value / themeUnit) * themeUnit;
        }
      },
      onPress: function() {
        dispatch(setEventDrawerTweenEditing({id: tweenId}));
        gsap.set(guide, {x: this.x + (themeUnit * 4)});
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
        gsap.set(guide, {x: `+=${this.deltaX}`});
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
        const duration = (((this.x + themeUnit * 4) - leftHandlePos) / 4) / 100;
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
      const rightHandlePos = ((tween.delay * 100) * themeUnit) + ((tween.duration * 100) * themeUnit) - themeUnit * 4;
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
      <div className='c-timeline-handle__ellipse' />
      <span
        id={`${tweenId}-tooltip-right`}
        className='c-timeline-handle__tooltip' />
    </div>
  );
}

export default TimelineRightHandle;