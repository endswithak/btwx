/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from "gsap/Draggable";
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { SetLayerTweenDurationPayload, SetLayerTweenDelayPayload, IncrementLayerTweenDurationPayload, DecrementLayerTweenDurationPayload, IncrementLayerTweenDelayPayload, DecrementLayerTweenDelayPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerTweenDuration, setLayerTweenDelay, incrementLayerTweenDuration, decrementLayerTweenDuration, incrementLayerTweenDelay, decrementLayerTweenDelay } from '../store/actions/layer';
gsap.registerPlugin(Draggable);

interface TweenDrawerEventLayerTweenTimelineProps {
  tweenId: string;
  tween?: em.Tween;
  setLayerTweenDuration?(payload: SetLayerTweenDurationPayload): LayerTypes;
  setLayerTweenDelay?(payload: SetLayerTweenDelayPayload): LayerTypes;
  incrementLayerTweenDuration?(payload: IncrementLayerTweenDurationPayload): LayerTypes;
  decrementLayerTweenDuration?(payload: DecrementLayerTweenDurationPayload): LayerTypes;
  incrementLayerTweenDelay?(payload: IncrementLayerTweenDelayPayload): LayerTypes;
  decrementLayerTweenDelay?(payload: DecrementLayerTweenDelayPayload): LayerTypes;
}

const TweenDrawerEventLayerTweenTimeline = (props: TweenDrawerEventLayerTweenTimelineProps): ReactElement => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<HTMLDivElement>(null);
  const leftHandleRef = useRef<HTMLDivElement>(null);
  const rightHandleRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { tweenId, tween, setLayerTweenDuration, setLayerTweenDelay, incrementLayerTweenDuration, decrementLayerTweenDuration, incrementLayerTweenDelay, decrementLayerTweenDelay } = props;

  useEffect(() => {
    if (tweenRef.current) {
      const rightHandleInitialPos = ((tween.delay * 100) * theme.unit) + ((tween.duration * 100) * theme.unit) - theme.unit * 3;
      const leftHandleInitialPos = ((tween.delay * 100) * theme.unit) + theme.unit;
      gsap.set(leftHandleRef.current, {x: leftHandleInitialPos});
      gsap.set(rightHandleRef.current, {x: rightHandleInitialPos});
      gsap.set(tweenRef.current, {x: (tween.delay * 100) * theme.unit, width: (tween.duration * 100) * theme.unit});
      Draggable.create(tweenRef.current, {
        type: 'x',
        zIndexBoost: false,
        bounds: timelineRef.current,
        liveSnap: {
          x: function(value) {
            return Math.round(value / theme.unit) * theme.unit;
          }
        },
        onDrag: function() {
          const factor = this.deltaX / 4;
          if (this.deltaX < 0) {
            decrementLayerTweenDelay({id: tweenId, factor: factor * -1});
          } else {
            incrementLayerTweenDelay({id: tweenId, factor: factor});
          }
          gsap.set([leftHandleRef.current, rightHandleRef.current], {x: `+=${theme.unit * factor}`});
          Draggable.get(rightHandleRef.current).update();
          Draggable.get(leftHandleRef.current).update().applyBounds({ minX: theme.unit, maxX: Draggable.get(rightHandleRef.current).x, minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight });
        }
      });
      Draggable.create(leftHandleRef.current, {
        type: 'x',
        bounds: { minX: theme.unit, maxX: Draggable.get(rightHandleRef.current) ? Draggable.get(rightHandleRef.current).x : rightHandleInitialPos, minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight },
        minX: theme.unit,
        liveSnap: {
          x: function(value) {
            return Math.round(value / theme.unit) * theme.unit;
          }
        },
        onDrag: function() {
          const factor = this.deltaX / 4;
          if (this.deltaX < 0) {
            incrementLayerTweenDuration({id: tweenId, factor: factor * -1});
          } else {
            decrementLayerTweenDuration({id: tweenId, factor: factor});
            incrementLayerTweenDelay({id: tweenId, factor: factor});
          }
          gsap.set(tweenRef.current, {x: `+=${theme.unit * factor}`, width: `-=${theme.unit * factor}`});
          Draggable.get(tweenRef.current).update(true, false);
        }
      });
      Draggable.create(rightHandleRef.current, {
        type: 'x',
        bounds: { minX: Draggable.get(leftHandleRef.current) ? Draggable.get(leftHandleRef.current).x : leftHandleInitialPos, maxX: timelineRef.current.clientWidth - theme.unit, minY: timelineRef.current.clientHeight, maxY: timelineRef.current.clientHeight },
        liveSnap: {
          x: function(value) {
            return Math.round(value / theme.unit) * theme.unit;
          }
        },
        onDrag: function() {
          const factor = this.deltaX / 4;
          if (this.deltaX < 0) {
            decrementLayerTweenDuration({id: tweenId, factor: factor * -1});
          } else {
            incrementLayerTweenDuration({id: tweenId, factor: factor});
          }
          gsap.set(tweenRef.current, {width: `+=${theme.unit * factor}`});
          Draggable.get(tweenRef.current).update(true, false);
        }
      });
    }
  }, []);

  return (
    <div
      className={`c-tween-drawer-event-layer__tween-timeline`}
      style={{
        color: theme.text.lighter
      }}
      ref={timelineRef}>
      <div
        ref={tweenRef}
        style={{
          height: theme.unit * 4,
          position: 'relative',
          background: theme.palette.primary
        }}>
      </div>
      <div
        ref={leftHandleRef}
        style={{
          position: 'absolute',
          height: theme.unit * 2,
          width: theme.unit * 2,
          background: theme.text.base
        }} />
      <div
        ref={rightHandleRef}
        style={{
          position: 'absolute',
          height: theme.unit * 2,
          width: theme.unit * 2,
          background: theme.text.base
        }} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerTweenTimelineProps) => {
  const { layer } = state;
  const tween = layer.present.tweenById[ownProps.tweenId];
  return { tween };
};

export default connect(
  mapStateToProps,
  {setLayerTweenDuration, setLayerTweenDelay, incrementLayerTweenDuration, decrementLayerTweenDuration, incrementLayerTweenDelay, decrementLayerTweenDelay}
)(TweenDrawerEventLayerTweenTimeline);