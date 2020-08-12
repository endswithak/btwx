/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface GradientSliderProps {
  stop: em.GradientStop;
  index: number;
  activeStopIndex: number;
  onStopPress(index: number): void;
  onStopDrag(index: number, position: number): void;
}

const GradientSliderStop = (props: GradientSliderProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { stop, index, activeStopIndex, onStopPress, onStopDrag } = props;
  const [prevPos, setPrevPos] = useState(stop.position);

  const initDraggable = () => {
    if (ref.current) {
      if (Draggable.get(ref.current)) {
        Draggable.get(ref.current).kill();
      }
      gsap.set(ref.current, {x: `${stop.position * 100}%`});
      Draggable.create(ref.current, {
        type: 'x',
        zIndexBoost: false,
        bounds: '#c-gradient-slider__slider',
        onPress: function() {
          onStopPress(index);
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
        }
      });
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
      className='c-gradient-slider__pointer'>
      <div
        className='c-gradient-slider__circle'
        style={{
          boxShadow: index === activeStopIndex
          ? `0 0 0 2px #fff, 0 0 0 3px ${theme.palette.primary}, 0 0 0 1px rgba(0, 0, 0, 0.3) inset, 0 0 0 3px rgba(0, 0, 0, 0.3)`
          : `0 0 0 2px #fff, 0 0 0 1px rgba(0, 0, 0, 0.3) inset, 0 0 0 3px rgba(0, 0, 0, 0.3)`
        }} />
    </div>
  );
}

export default GradientSliderStop;