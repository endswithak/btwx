/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import tinyColor from 'tinycolor2';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
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

interface ColorPickerProps {
  colorValues: {
    [id: string]: Btwx.Color;
  };
  autoFocus?: boolean;
  onChange(colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void;
}

const ColorPicker = (props: ColorPickerProps): ReactElement => {
  const colorFormat = useSelector((state: RootState) => state.documentSettings.colorFormat);
  const { onChange, colorValues, autoFocus } = props;
  const [hex, setHex] = useState<'multi' | string>('');
  const [hue, setHue] = useState<'multi' | number>(0);
  const [saturation, setSaturation] = useState<'multi' | number>(0);
  const [lightness, setLightness] = useState<'multi' | number>(0);
  const [alpha, setAlpha] = useState<'multi' | number>(0);
  const [red, setRed] = useState<'multi' | number>(0);
  const [green, setGreen] = useState<'multi' | number>(0);
  const [blue, setBlue] = useState<'multi' | number>(0);
  const [ready, setReady] = useState(false);

  const updateValues = () => {
    let pickerHex: 'multi' | string;
    let pickerHue: 'multi' | number;
    let pickerSaturation: 'multi' | number;
    let pickerLightness: 'multi' | number;
    let pickerAlpha: 'multi' | number;
    let pickerRed: 'multi' | number;
    let pickerGreen: 'multi' | number;
    let pickerBlue: 'multi' | number;
    Object.keys(colorValues).forEach((key, index) => {
      const color = colorValues[key];
      const colorInstance = tinyColor({h: color.h, s: color.s, l: color.l});
      const rgb = colorInstance.toRgb();
      const colorHex = colorInstance.toHex();
      if (index === 0) {
        pickerHex = colorHex;
        pickerHue = color.h;
        pickerSaturation = color.s;
        pickerLightness = color.l;
        pickerAlpha = color.a;
        pickerRed = rgb.r;
        pickerGreen = rgb.g;
        pickerBlue = rgb.b;
      } else {
        if (pickerHex !== 'multi' && pickerHex !== colorHex) {
          pickerHex = 'multi';
        }
        if (pickerHue !== 'multi' && pickerHue !== color.h) {
          pickerHue = 'multi';
        }
        if (pickerSaturation !== 'multi' && pickerSaturation !== color.s) {
          pickerSaturation = 'multi';
        }
        if (pickerLightness !== 'multi' && pickerLightness !== color.l) {
          pickerLightness = 'multi';
        }
        if (pickerAlpha !== 'multi' && pickerAlpha !== color.a) {
          pickerAlpha = 'multi';
        }
        if (pickerRed !== 'multi' && pickerRed !== rgb.r) {
          pickerRed = 'multi';
        }
        if (pickerGreen !== 'multi' && pickerGreen !== rgb.g) {
          pickerGreen = 'multi';
        }
        if (pickerBlue !== 'multi' && pickerBlue !== rgb.b) {
          pickerBlue = 'multi';
        }
      }
    });
    setHex(pickerHex);
    setHue(pickerHue);
    setSaturation(pickerSaturation);
    setLightness(pickerLightness);
    setAlpha(pickerAlpha);
    setRed(pickerRed);
    setGreen(pickerGreen);
    setBlue(pickerBlue);
  }

  useEffect(() => {
    updateValues();
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      updateValues();
    }
  }, [colorValues]);

  return (
    <>
      {
        ready
        ? <div className='c-color-picker'>
            <div className='c-color-picker__saturation'>
              <ColorPickerSaturation
                hue={hue}
                saturation={saturation}
                lightness={lightness}
                colorValues={colorValues}
                setHex={setHex}
                setSaturation={setSaturation}
                setLightness={setLightness}
                setRed={setRed}
                setGreen={setGreen}
                setBlue={setBlue}
                onChange={onChange} />
            </div>
            <div className='c-color-picker__controls'>
              <div className='c-color-picker__sliders'>
                <ColorPickerHue
                  hue={hue}
                  colorValues={colorValues}
                  setHue={setHue}
                  setHex={setHex}
                  setRed={setRed}
                  setGreen={setGreen}
                  setBlue={setBlue}
                  onChange={onChange} />
                <ColorPickerAlpha
                  hue={hue}
                  saturation={saturation}
                  lightness={lightness}
                  alpha={alpha}
                  colorValues={colorValues}
                  setAlpha={setAlpha}
                  onChange={onChange} />
              </div>
              <div className='c-color-picker__color'>
                <ColorPickerColor
                  hue={hue}
                  saturation={saturation}
                  lightness={lightness}
                  alpha={alpha} />
              </div>
            </div>
            <div className='c-color-picker__fields c-color-picker__fields--hex'>
              <ColorPickerHexInput
                autoFocus={autoFocus}
                hex={hex}
                colorValues={colorValues}
                setHex={setHex}
                setHue={setHue}
                setSaturation={setSaturation}
                setLightness={setLightness}
                setRed={setRed}
                setGreen={setGreen}
                setBlue={setBlue}
                onChange={onChange} />
              <ColorPickerAlphaInput
                alpha={alpha}
                colorValues={colorValues}
                setAlpha={setAlpha}
                onChange={onChange} />
            </div>
            <div className='c-color-picker__fields c-color-picker__fields--rgb'>
              {
                colorFormat === 'rgb'
                ? <>
                    <ColorPickerRedInput
                      red={red}
                      colorValues={colorValues}
                      setRed={setRed}
                      setHex={setHex}
                      setHue={setHue}
                      setSaturation={setSaturation}
                      setLightness={setLightness}
                      onChange={onChange} />
                    <ColorPickerGreenInput
                      green={green}
                      colorValues={colorValues}
                      setGreen={setGreen}
                      setHex={setHex}
                      setHue={setHue}
                      setSaturation={setSaturation}
                      setLightness={setLightness}
                      onChange={onChange} />
                    <ColorPickerBlueInput
                      blue={blue}
                      colorValues={colorValues}
                      setBlue={setBlue}
                      setHex={setHex}
                      setHue={setHue}
                      setSaturation={setSaturation}
                      setLightness={setLightness}
                      onChange={onChange} />
                  </>
                : <>
                    <ColorPickerHueInput
                      hue={hue}
                      colorValues={colorValues}
                      setHue={setHue}
                      setHex={setHex}
                      setRed={setRed}
                      setGreen={setGreen}
                      setBlue={setBlue}
                      onChange={onChange} />
                    <ColorPickerSaturationInput
                      saturation={saturation}
                      colorValues={colorValues}
                      setSaturation={setSaturation}
                      setHex={setHex}
                      setRed={setRed}
                      setGreen={setGreen}
                      setBlue={setBlue}
                      onChange={onChange} />
                    <ColorPickerLightnessInput
                      lightness={lightness}
                      colorValues={colorValues}
                      setLightness={setLightness}
                      setHex={setHex}
                      setRed={setRed}
                      setGreen={setGreen}
                      setBlue={setBlue}
                      onChange={onChange} />
                  </>
              }
              <ColorPickerTypeToggle
                type={colorFormat} />
            </div>
            <div className='c-color-picker__presets'>

            </div>
          </div>
        : null
      }
    </>
  );
}

export default ColorPicker;