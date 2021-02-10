/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { RootState } from '../store/reducers';
import { setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
import { setLayerTweenDelay } from '../store/actions/layer';

gsap.registerPlugin(Draggable);

interface TimelineTweenHandleProps {
  tweenId: string;
}

const TimelineTweenHandle = (props: TimelineTweenHandleProps): ReactElement => {
  const themeUnit = 4;
  const { tweenId } = props;
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
  const [prevDuration, setPrevDuration] = useState(tween.duration);
  const [prevDelay, setPrevDelay] = useState(tween.delay);
  const [prevId, setPrevId] = useState(tweenId);
  const dispatch = useDispatch();

  const setupHandle = (): void => {
    const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
    if (Draggable.get(tweenHandleElement)) {
      Draggable.get(tweenHandleElement).kill();
    }
    const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
    const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
    const leftHandleTooltipElement = document.getElementById(`${tweenId}-tooltip-left`);
    const timelineElement = document.getElementById(`${tweenId}-timeline`);
    const guide = document.getElementById('event-drawer-guide');
    gsap.set(tweenHandleElement, {x: (tween.delay * 100) * themeUnit, width: (tween.duration * 100) * themeUnit});
    Draggable.create(tweenHandleElement, {
      type: 'x',
      zIndexBoost: false,
      bounds: {
        minX: 0,
        maxX: timelineElement.clientWidth - tweenHandleElement.clientWidth,
        minY: timelineElement.clientHeight,
        maxY: timelineElement.clientHeight
      },
      autoScroll: 1,
      liveSnap: {
        x: function(value): number {
          return Math.round(value / themeUnit) * themeUnit;
        }
      },
      onPress: function() {
        dispatch(setEventDrawerTweenEditing({id: tweenId}));
        gsap.set(guide, {x: (gsap.getProperty(rightHandleElement, 'x') as number) + (themeUnit * 4)});
        gsap.set(leftHandleTooltipElement, {display: 'inline'});
        leftHandleTooltipElement.innerHTML = `${(gsap.getProperty(leftHandleElement, 'x') as number / 4) / 100}s`;
        document.body.style.cursor = 'grabbing';
      },
      onRelease: function() {
        dispatch(setEventDrawerTweenEditing({id: null}));
        gsap.set(leftHandleTooltipElement, {display: 'none'});
        document.body.style.cursor = 'auto';
      },
      onDrag: function() {
        gsap.set(guide, {x: (gsap.getProperty(rightHandleElement, 'x') as number) + (themeUnit * 4)});
        gsap.set([leftHandleElement, rightHandleElement], {x: `+=${this.deltaX}`});
        leftHandleTooltipElement.innerHTML = `${(gsap.getProperty(leftHandleElement, 'x') as number / 4) / 100}s`;
      },
      onDragEnd: function() {
        const distance = this.endX - this.startX;
        Draggable.get(rightHandleElement).update().applyBounds({
          minX: Draggable.get(leftHandleElement).x + distance,
          maxX: timelineElement.clientWidth - (themeUnit * 4),
          minY: timelineElement.clientHeight,
          maxY: timelineElement.clientHeight
        });
        Draggable.get(leftHandleElement).update().applyBounds({
          minX: 0,
          maxX: Draggable.get(rightHandleElement).x,
          minY: timelineElement.clientHeight,
          maxY: timelineElement.clientHeight
        });
        const leftHandlePos = Draggable.get(leftHandleElement).x;
        const delay = (leftHandlePos / 4) / 100;
        setPrevDelay(delay);
        dispatch(setLayerTweenDelay({id: tweenId, delay }));
      }
    });
  }

  // initial render
  useEffect(() => {
    setupHandle();
    return (): void => {
      const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
      if (Draggable.get(tweenHandleElement)) {
        Draggable.get(tweenHandleElement).kill();
      }
    }
  }, []);

  // updates bounds when delay or duration changes outside handles scope (ease editor)
  useEffect(() => {
    if (prevDuration !== tween.duration || prevDelay !== tween.delay) {
      const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
      const timelineElement = document.getElementById(`${tweenId}-timeline`);
      gsap.set(tweenHandleElement, { x: (tween.delay * 100) * themeUnit, width: (tween.duration * 100) * themeUnit });
      Draggable.get(tweenHandleElement).update().applyBounds({
        minX: 0,
        maxX: timelineElement.clientWidth - tweenHandleElement.clientWidth,
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
      id={`${tweenId}-handle-tween`}
      className='c-timeline-tween-handle' />
  );
}

export default TimelineTweenHandle;