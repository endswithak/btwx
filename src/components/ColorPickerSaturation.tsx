/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface ColorPickerSaturationProps {
  hue: number | 'multi';
  saturation: number | 'multi';
  value: number | 'multi';
  lightness: number | 'multi';
  colorValues: {
    [id: string]: Btwx.Color;
  };
  setHex(hex: string | 'multi'): void;
  setSaturation(saturation: number | 'multi'): void;
  setLightness(lightness: number | 'multi'): void;
  setValue(value: number | 'multi'): void;
  setRed(red: number | 'multi'): void;
  setGreen(green: number | 'multi'): void;
  setBlue(blue: number | 'multi'): void;
  onChange(colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void;
}

const ColorPickerSaturation = (props: ColorPickerSaturationProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, value, lightness, setHex, setSaturation, setLightness, setValue, setRed, setGreen, setBlue, onChange, colorValues } = props;
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
          const sat = s < 0 ? 0 : s > 1 ? 1 : s;
          const lit = l < 0 ? 0 : l > 1 ? 1 : l;
          const val = v < 0 ? 0 : v > 1 ? 1 : v;
          let hex: string | 'multi';
          let red: number | 'multi';
          let green: number | 'multi';
          let blue: number | 'multi';
          const newColors = Object.keys(colorValues).reduce((result, current, index) => {
            const colorInstance = tinyColor({h: colorValues[current].h, s: sat, l: lit, v: val});
            const newHex = colorInstance.toHex();
            const rgb = colorInstance.toRgb();
            if (index === 0) {
              hex = newHex;
              red = rgb.r;
              green = rgb.g;
              blue = rgb.b;
            } else {
              if (hex !== 'multi' && hex !== newHex) {
                hex = 'multi';
              }
              if (red !== 'multi' && red !== rgb.r) {
                red = 'multi';
              }
              if (green !== 'multi' && green !== rgb.g) {
                green = 'multi';
              }
              if (blue !== 'multi' && blue !== rgb.b) {
                blue = 'multi';
              }
            }
            return {
              ...result,
              [current]: { s: sat, l: lit, v: val }
            };
          }, {});
          setHex(hex);
          setSaturation(sat);
          setLightness(lit);
          setValue(val);
          setRed(red);
          setGreen(green);
          setBlue(blue);
          onChange(newColors);
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
        x: thing.maxX * (lightness === 1 || lightness === 'multi' ? 0 : saturation !== 'multi' ? saturation : 0 ),
        y: thing.maxY * (-(value !== 'multi' ? value : 0) + 1)
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
      const sat = s < 0 ? 0 : s > 1 ? 1 : s;
      const lit = l < 0 ? 0 : l > 1 ? 1 : l;
      const val = v < 0 ? 0 : v > 1 ? 1 : v;
      setDragging(true);
      let hex: string | 'multi';
      let red: number | 'multi';
      let green: number | 'multi';
      let blue: number | 'multi';
      const newColors = Object.keys(colorValues).reduce((result, current, index) => {
        const colorInstance = tinyColor({h: colorValues[current].h, s: sat, l: lit, v: val});
        const newHex = colorInstance.toHex();
        const rgb = colorInstance.toRgb();
        if (index === 0) {
          hex = newHex;
          red = rgb.r;
          green = rgb.g;
          blue = rgb.b;
        } else {
          if (hex !== 'multi' && hex !== newHex) {
            hex = 'multi';
          }
          if (red !== 'multi' && red !== rgb.r) {
            red = 'multi';
          }
          if (green !== 'multi' && green !== rgb.g) {
            green = 'multi';
          }
          if (blue !== 'multi' && blue !== rgb.b) {
            blue = 'multi';
          }
        }
        return {
          ...result,
          [current]: { s: sat, l: lit, v: val }
        };
      }, {});
      setHex(hex);
      setSaturation(sat);
      setLightness(lit);
      setValue(val);
      setRed(red);
      setGreen(green);
      setBlue(blue);
      onChange(newColors);
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
          background: `hsl(${ hue !== 'multi' ? hue : 0 },100%, 50%)`
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