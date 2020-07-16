/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect, useCallback } from 'react';
//import chroma from 'chroma-js';
import { ThemeContext } from './ThemeProvider';
import ColorPickerSaturation from './ColorPickerSaturation';
import ColorPickerHue from './ColorPickerHue';
import ColorPickerAlpha from './ColorPickerAlpha';
import ColorPickerColor from './ColorPickerColor';
import ColorPickerHexInput from './ColorPickerHexInput';
import ColorPickerRedInput from './ColorPickerRedInput';
import ColorPickerGreenInput from './ColorPickerGreenInput';
import ColorPickerBlueInput from './ColorPickerBlueInput';
import ColorPickerAlphaInput from './ColorPickerAlphaInput';
import ColorPickerHueInput from './ColorPickerHueInput';
import ColorPickerSaturationInput from './ColorPickerSaturationInput';
import ColorPickerLightnessInput from './ColorPickerLightnessInput';
import ColorPickerTypeToggle from './ColorPickerTypeToggle';
import tinyColor from 'tinycolor2';

interface ColorPickerProps {
  colorValue: em.Color;
  colorType: 'hsl' | 'rgb';
  onChange?(color: em.Color): void;
}

const ColorPicker = (props: ColorPickerProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { onChange, colorType, colorValue } = props;
  const color = tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l, a: colorValue.a});
  const rgb = color.toRgb();
  const hue = colorValue.h;
  const saturation = colorValue.s;
  const lightness = colorValue.l;
  const value = colorValue.v;
  const alpha = colorValue.a;
  const red = rgb.r;
  const green = rgb.g;
  const blue = rgb.b;
  const [type, setType] = useState(colorType);

  return (
    <div className='c-color-picker'>
      <div className='c-color-picker__saturation'>
        <ColorPickerSaturation
          hue={hue}
          saturation={saturation}
          lightness={lightness}
          value={value}
          alpha={alpha}
          onChange={onChange} />
      </div>
      <div className='c-color-picker__controls'>
        <div className='c-color-picker__sliders'>
          <ColorPickerHue
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            value={value}
            alpha={alpha}
            onChange={onChange} />
          <ColorPickerAlpha
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            value={value}
            alpha={alpha}
            onChange={onChange} />
        </div>
        <div className='c-color-picker__color'>
          <ColorPickerColor
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            value={value}
            alpha={alpha} />
        </div>
      </div>
      <div className='c-color-picker__fields c-color-picker__fields--hex'>
        <ColorPickerHexInput
          hue={hue}
          saturation={saturation}
          lightness={lightness}
          value={value}
          alpha={alpha}
          onChange={onChange} />
        <ColorPickerAlphaInput
          hue={hue}
          saturation={saturation}
          lightness={lightness}
          value={value}
          alpha={alpha}
          onChange={onChange} />
      </div>
      <div className='c-color-picker__fields c-color-picker__fields--rgb'>
        {
          type === 'rgb'
          ? <>
              <ColorPickerRedInput
                red={red}
                green={green}
                blue={blue}
                alpha={alpha}
                onChange={onChange} />
              <ColorPickerGreenInput
                red={red}
                green={green}
                blue={blue}
                alpha={alpha}
                onChange={onChange} />
              <ColorPickerBlueInput
                red={red}
                green={green}
                blue={blue}
                alpha={alpha}
                onChange={onChange} />
            </>
          : <>
              <ColorPickerHueInput
                hue={hue}
                saturation={saturation}
                lightness={lightness}
                value={value}
                alpha={alpha}
                onChange={onChange} />
              <ColorPickerSaturationInput
                hue={hue}
                saturation={saturation}
                lightness={lightness}
                value={value}
                alpha={alpha}
                onChange={onChange} />
              <ColorPickerLightnessInput
                hue={hue}
                saturation={saturation}
                lightness={lightness}
                value={value}
                alpha={alpha}
                onChange={onChange} />
            </>
        }
        <ColorPickerTypeToggle
          type={type}
          setType={setType} />
      </div>
      <div className='c-color-picker__presets'>

      </div>
    </div>
  );
}

export default ColorPicker;