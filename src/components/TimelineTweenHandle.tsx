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

interface TimelineTweenHandleProps {
  tweenId: string;
  tween?: Btwx.Tween;
  setLayerTweenDuration?(payload: SetLayerTweenDurationPayload): LayerTypes;
  setLayerTweenDelay?(payload: SetLayerTweenDelayPayload): LayerTypes;
  setTweenDrawerTweenEditing?(payload: SetTweenDrawerTweenEditingPayload): TweenDrawerTypes;
}

const TimelineTweenHandle = (props: TimelineTweenHandleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, tween, setLayerTweenDelay, setTweenDrawerTweenEditing } = props;
  const [prevDuration, setPrevDuration] = useState(tween.duration);
  const [prevDelay, setPrevDelay] = useState(tween.delay);
  const [prevId, setPrevId] = useState(tweenId);

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
        setTweenDrawerTweenEditing({id: tweenId});
        gsap.set(leftHandleTooltipElement, {display: 'inline'});
        leftHandleTooltipElement.innerHTML = `${(gsap.getProperty(leftHandleElement, 'x') as number / 4) / 100}s`;
        document.body.style.cursor = 'grabbing';
      },
      onRelease: function() {
        setTweenDrawerTweenEditing({id: null});
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
        setLayerTweenDelay({id: tweenId, delay });
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

const mapStateToProps = (state: RootState, ownProps: TimelineTweenHandleProps): {
  tween: Btwx.Tween;
} => {
  const { layer } = state;
  const tween = layer.present.tweens.byId[ownProps.tweenId];
  return { tween };
};

export default connect(
  mapStateToProps,
  { setLayerTweenDuration, setLayerTweenDelay, setTweenDrawerTweenEditing }
)(TimelineTweenHandle);