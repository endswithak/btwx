/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, forwardRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface GradientSliderProps {
  stop: em.GradientStop;
  onStopPress(id: string): void;
  onStopDrag(id: string, position: number): void;
}

const GradientSliderStop = (props: GradientSliderProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { stop, onStopPress, onStopDrag } = props;

  useEffect(() => {
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
          onStopPress(stop.id);
        },
        onDrag: function() {
          let newPosition = this.x / this.maxX;
          if (newPosition < 0) {
            newPosition = 0;
          } else if (newPosition > 1) {
            newPosition = 1;
          }
          onStopDrag(stop.id, newPosition);
        }
      });
    }
  }, []);

  return (
    <div
      ref={ref}
      className='c-gradient-slider__pointer'>
      <div
        className='c-gradient-slider__circle'
        style={{
          boxShadow: stop.active
          ? `0 0 0 1.5px #fff, 0 0 0 3.5px ${theme.palette.primary}, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4)`
          : `0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4)`
        }} />
    </div>
  );
}

export default GradientSliderStop;