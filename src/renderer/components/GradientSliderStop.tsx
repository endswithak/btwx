/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface GradientSliderProps {
  stop: Btwx.GradientStop;
  index: number;
  activeStopIndex: number;
  onStopPress(index: number): void;
  onStopDrag(index: number, position: number): void;
}

const GradientSliderStop = (props: GradientSliderProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const { stop, index, activeStopIndex, onStopPress, onStopDrag } = props;
  const [prevPos, setPrevPos] = useState(stop.position);
  const [dragging, setDragging] = useState(false);

  const initDraggable = () => {
    if (ref.current) {
      if (Draggable.get(ref.current)) {
        Draggable.get(ref.current).kill();
      }
      const draggable = Draggable.create(ref.current, {
        type: 'x',
        zIndexBoost: false,
        bounds: '#c-gradient-slider__slider',
        onPress: function() {
          onStopPress(index);
          setDragging(true);
        },
        onDragStart: function() {
          document.body.style.cursor = 'grabbing';
        },
        onDrag: function() {
          let newPosition = this.x / this.maxX;
          if (newPosition < 0) {
            newPosition = 0;
          } else if (newPosition > 1) {
            newPosition = 1;
          }
          onStopDrag(index, newPosition);
          setPrevPos(newPosition);
        },
        onRelease: function() {
          document.body.style.cursor = 'auto';
          setDragging(false);
        }
      })[0];
      gsap.set(ref.current, {x: stop.position * draggable.maxX});
      draggable.update();
    }
  }

  useEffect(() => {
    initDraggable();
  }, []);

  useEffect(() => {
    if (stop.position !== prevPos) {
      initDraggable();
      setPrevPos(stop.position);
    }
  }, [stop.position]);

  return (
    <div
      ref={ref}
      className={`c-gradient-slider__pointer${
        dragging
        ? `${' '}c-gradient-slider__pointer--dragging`
        : ''
      }`}>
      <div
        className={`c-gradient-slider__circle${
          index === activeStopIndex
          ? `${' '}c-gradient-slider__circle--active`
          : ''
        }`} />
    </div>
  );
}

export default GradientSliderStop;