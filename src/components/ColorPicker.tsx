/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect, useCallback } from 'react';
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
  const [hue, setHue] = useState(colorValue.h);
  const [saturation, setSaturation] = useState(colorValue.s);
  const [lightness, setLightness] = useState(colorValue.l);
  const [value, setValue] = useState(colorValue.v);
  const [alpha, setAlpha] = useState(colorValue.a);
  const [red, setRed] = useState(rgb.r);
  const [green, setGreen] = useState(rgb.g);
  const [blue, setBlue] = useState(rgb.b);
  const [type, setType] = useState(colorType);

  useEffect(() => {
    const color = tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l, a: colorValue.a});
    const rgb = color.toRgb();
    setHue(colorValue.h);
    setSaturation(colorValue.s);
    setLightness(colorValue.l);
    setValue(colorValue.v);
    setAlpha(colorValue.a);
    setRed(rgb.r);
    setGreen(rgb.g);
    setBlue(rgb.b);
  }, [colorValue]);

  return (
    <div className='c-color-picker'>
      <div className='c-color-picker__saturation'>
        <ColorPickerSaturation
          hue={hue}
          saturation={saturation}
          lightness={lightness}
          value={value}
          alpha={alpha}
          setRed={setRed}
          setGreen={setGreen}
          setBlue={setBlue}
          setSaturation={setSaturation}
          setLightness={setLightness}
          setValue={setValue}
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
            setHue={setHue}
            setRed={setRed}
            setGreen={setGreen}
            setBlue={setBlue}
            onChange={onChange} />
          <ColorPickerAlpha
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            value={value}
            alpha={alpha}
            setAlpha={setAlpha}
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
          setRed={setRed}
          setGreen={setGreen}
          setBlue={setBlue}
          setHue={setHue}
          setSaturation={setSaturation}
          setLightness={setLightness}
          setValue={setValue}
          onChange={onChange} />
        <ColorPickerAlphaInput
          hue={hue}
          saturation={saturation}
          lightness={lightness}
          value={value}
          alpha={alpha}
          setAlpha={setAlpha}
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
                setRed={setRed}
                setHue={setHue}
                setSaturation={setSaturation}
                setLightness={setLightness}
                setValue={setValue}
                onChange={onChange} />
              <ColorPickerGreenInput
                red={red}
                green={green}
                blue={blue}
                alpha={alpha}
                setGreen={setGreen}
                setHue={setHue}
                setSaturation={setSaturation}
                setLightness={setLightness}
                setValue={setValue}
                onChange={onChange} />
              <ColorPickerBlueInput
                red={red}
                green={green}
                blue={blue}
                alpha={alpha}
                setBlue={setBlue}
                setHue={setHue}
                setSaturation={setSaturation}
                setLightness={setLightness}
                setValue={setValue}
                onChange={onChange} />
            </>
          : <>
              <ColorPickerHueInput
                hue={hue}
                saturation={saturation}
                lightness={lightness}
                value={value}
                alpha={alpha}
                setHue={setHue}
                setRed={setRed}
                setGreen={setGreen}
                setBlue={setBlue}
                onChange={onChange} />
              <ColorPickerSaturationInput
                hue={hue}
                saturation={saturation}
                lightness={lightness}
                value={value}
                alpha={alpha}
                setSaturation={setSaturation}
                setRed={setRed}
                setGreen={setGreen}
                setBlue={setBlue}
                onChange={onChange} />
              <ColorPickerLightnessInput
                hue={hue}
                saturation={saturation}
                lightness={lightness}
                value={value}
                alpha={alpha}
                setLightness={setLightness}
                setRed={setRed}
                setGreen={setGreen}
                setBlue={setBlue}
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