/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setTweenDrawerTweenEditing } from '../store/actions/tweenDrawer';
import { setLayerTweenDelay } from '../store/actions/layer';

gsap.registerPlugin(Draggable);

interface TimelineTweenHandleProps {
  tweenId: string;
}

const TimelineTweenHandle = (props: TimelineTweenHandleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId } = props;
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
  const [prevDuration, setPrevDuration] = useState(tween.duration);
  const [prevDelay, setPrevDelay] = useState(tween.delay);
  const [prevId, setPrevId] = useState(tweenId);
  const dispatch = useDispatch();

  const setupHandle = () => {
    const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
    if (Draggable.get(tweenHandleElement)) {
      Draggable.get(tweenHandleElement).kill();
    }
    const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
    const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
    const leftHandleTooltipElement = document.getElementById(`${tweenId}-tooltip-left`);
    const timelineElement = document.getElementById(`${tweenId}-timeline`);
    gsap.set(tweenHandleElement, {x: (tween.delay * 100) * theme.unit, width: (tween.duration * 100) * theme.unit});
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
          return Math.round(value / theme.unit) * theme.unit;
        }
      },
      onPress: function() {
        dispatch(setTweenDrawerTweenEditing({id: tweenId}));
        gsap.set(leftHandleTooltipElement, {display: 'inline'});
        leftHandleTooltipElement.innerHTML = `${(gsap.getProperty(leftHandleElement, 'x') as number / 4) / 100}s`;
        document.body.style.cursor = 'grabbing';
      },
      onRelease: function() {
        dispatch(setTweenDrawerTweenEditing({id: null}));
        gsap.set(leftHandleTooltipElement, {display: 'none'});
        document.body.style.cursor = 'auto';
      },
      onDrag: function() {
        gsap.set([leftHandleElement, rightHandleElement], {x: `+=${this.deltaX}`});
        leftHandleTooltipElement.innerHTML = `${(gsap.getProperty(leftHandleElement, 'x') as number / 4) / 100}s`;
      },
      onDragEnd: function() {
        const distance = this.endX - this.startX;
        Draggable.get(rightHandleElement).update().applyBounds({
          minX: Draggable.get(leftHandleElement).x + distance,
          maxX: timelineElement.clientWidth - (theme.unit * 4),
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
      gsap.set(tweenHandleElement, { x: (tween.delay * 100) * theme.unit, width: (tween.duration * 100) * theme.unit });
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
      className='c-timeline-tween-handle'
      style={{
        background: theme.palette.primary
      }} />
  );
}

export default TimelineTweenHandle;