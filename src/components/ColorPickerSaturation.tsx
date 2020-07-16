/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface ColorPickerSaturationProps {
  hue: number;
  saturation: number;
  value: number;
  lightness: number;
  alpha: number;
  onChange?(color: em.Color): void;
}

const ColorPickerSaturation = (props: ColorPickerSaturationProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, value, lightness, alpha, onChange } = props;
  const pointerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (pointerRef.current) {
      if (Draggable.get(pointerRef.current)) {
        Draggable.get(pointerRef.current).kill();
      }
      Draggable.create(pointerRef.current, {
        type: 'x,y',
        zIndexBoost: false,
        bounds: containerRef.current,
        onPress: function() {
          setDragging(true);
        },
        onDrag: function() {
          const s = this.x / this.maxX;
          const v = 1 - (this.y / this.maxY);
          const l = (2 - s) * v / 2;
          onChange({h: hue, s: s, l: l, v: v, a: alpha});
          //onChange(chroma.hsl(hue, s, l, alpha).hex());
        },
        onRelease: function() {
          setDragging(false);
        }
      });
    }
  }, [hue]);

  useEffect(() => {
    if (!dragging && pointerRef.current && Draggable.get(pointerRef.current)) {
      const thing = Draggable.get(pointerRef.current);
      gsap.set(pointerRef.current, {
        x: thing.maxX * (lightness === 1 ? 0 : saturation),
        y: thing.maxY * (-value + 1)
      });
      Draggable.get(pointerRef.current).update();
    }
  }, [saturation, value, lightness]);

  const handleMouseDown = (event: any) => {
    if (!dragging && pointerRef.current && Draggable.get(pointerRef.current)) {
      const boundingBox = containerRef.current.getBoundingClientRect();
      const x = event.clientX - boundingBox.left;
      const y = event.clientY - boundingBox.top;
      const s = x / boundingBox.width;
      const v = 1 - (y / boundingBox.height);
      const l = (2 - s) * v / 2;
      setDragging(true);
      //onChange(chroma.hsl(hue, s, l, alpha).hex());
      onChange({h: hue, s: s, l: l, v: v, a: alpha});
      gsap.set(pointerRef.current, {x, y});
      Draggable.get(pointerRef.current).update();
      Draggable.get(pointerRef.current).startDrag(event);
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className='c-color-picker-saturation'
      style={{
        boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
      }}>
      <div
        className='c-color-picker-saturation__color'
        style={{
          background: `hsl(${ hue },100%, 50%)`
        }} />
      <div className='c-color-picker-saturation__white' />
      <div className='c-color-picker-saturation__black' />
      <div
        ref={pointerRef}
        className='c-color-picker-saturation__pointer'>
        <div className='c-color-picker-saturation__circle' />
      </div>
    </div>
  );
}

export default ColorPickerSaturation;