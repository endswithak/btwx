/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { RootState } from '../store/reducers';
import { setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
import { setLayerTweenTiming } from '../store/actions/layer';

gsap.registerPlugin(Draggable);

interface TimelineLeftHandleProps {
  tweenId: string;
}

const TimelineLeftHandle = (props: TimelineLeftHandleProps): ReactElement => {
  const themeUnit = 4;
  const { tweenId } = props;
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
  const [prevDelay, setPrevDelay] = useState(tween.delay);
  const [prevId, setPrevId] = useState(tweenId);
  const dispatch = useDispatch();

  const setupHandle = (): void => {
    const rightHandleInitialPos = ((tween.delay * 100) * themeUnit) + ((tween.duration * 100) * themeUnit) - themeUnit * 4;
    const leftHandleInitialPos = ((tween.delay * 100) * themeUnit);
    const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
    if (Draggable.get(leftHandleElement)) {
      Draggable.get(leftHandleElement).kill();
    }
    const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
    const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
    const timelineElement = document.getElementById(`${tweenId}-timeline`);
    const leftTooltipElement = document.getElementById(`${tweenId}-tooltip-left`);
    const guide = document.getElementById('event-drawer-guide');
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
      minX: themeUnit,
      liveSnap: {
        x: function(value): number {
          return Math.round(value / themeUnit) * themeUnit;
        }
      },
      onPress: function() {
        dispatch(setEventDrawerTweenEditing({id: tweenId}));
        gsap.set(guide, {x: this.x});
        gsap.set(leftTooltipElement, {display: 'inline'});
        leftTooltipElement.innerHTML = `${(this.x / 4) / 100}s`;
        document.body.style.cursor = 'ew-resize';
      },
      onRelease: function() {
        dispatch(setEventDrawerTweenEditing({id: null}));
        gsap.set(leftTooltipElement, {display: 'none'});
        document.body.style.cursor = 'auto';
      },
      onDrag: function() {
        gsap.set(guide, {x: `+=${this.deltaX}`});
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
          maxX: timelineElement.clientWidth - (themeUnit * 4),
          minY: timelineElement.clientHeight,
          maxY: timelineElement.clientHeight
        });
        const rightHandlePos = Draggable.get(rightHandleElement).x;
        const duration = (((rightHandlePos + themeUnit * 4) - this.x) / 4) / 100;
        const delay = (this.x / 4) / 100;
        setPrevDelay(delay);
        dispatch(setLayerTweenTiming({id: tweenId, duration, delay}));
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
      const leftHandlePos = ((tween.delay * 100) * themeUnit);
      gsap.set(leftHandleElement, {x: leftHandlePos});
      Draggable.get(leftHandleElement).update();
      Draggable.get(rightHandleElement).update().applyBounds({
        minX: Draggable.get(leftHandleElement).x,
        maxX: timelineElement.clientWidth - (themeUnit * 4),
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
      <div className='c-timeline-handle__ellipse' />
      <span
        id={`${tweenId}-tooltip-left`}
        className='c-timeline-handle__tooltip' />
    </div>
  );
}

export default TimelineLeftHandle;