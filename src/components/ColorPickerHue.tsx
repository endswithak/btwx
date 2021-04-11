/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useState, useEffect, useRef, useCallback } from 'react';
import tinyColor from 'tinycolor2';
import debounce from 'lodash.debounce';
import { clearTouchbar } from '../utils';
import Form from './Form';

interface ColorPickerHueProps {
  hue: number | 'multi';
  colorValues: {
    [id: string]: Btwx.Color;
  };
  setHue(hue: number | 'multi'): void;
  setHex(hue: string | 'multi'): void;
  setRed(red: number | 'multi'): void;
  setGreen(green: number | 'multi'): void;
  setBlue(blue: number | 'multi'): void;
  onChange(colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void;
}

const ColorPickerHue = (props: ColorPickerHueProps): ReactElement => {
  const controlRef = useRef(null);
  const { hue, colorValues, setHue, setHex, setRed, setGreen, setBlue, onChange } = props;
  const [hueValue, setHueValue] = useState(hue !== 'multi' ? hue : 0);

  // const isMac = remote.process.platform === 'darwin';

  // const debounceBuildTouchbar = useCallback(
  //   debounce((nextHue: number) => {
  //     buildTouchBar(nextHue);
  //   }, 150),
  //   []
  // );

  // const buildTouchBar = (opt = hueValue as any): void => {
  //   const { TouchBarSlider } = remote.TouchBar;
  //   const hueSlider = new TouchBarSlider({
  //     label: 'Hue',
  //     value: parseInt(opt),
  //     minValue: 0,
  //     maxValue: 360,
  //     change: (nextHue): void => {
  //       handleHueChange(nextHue, false);
  //     }
  //   });
  //   const newTouchBar = new remote.TouchBar({
  //     items: [hueSlider]
  //   });
  //   remote.getCurrentWindow().setTouchBar(newTouchBar);
  // }

  useEffect(() => {
    setHueValue(hue !== 'multi' ? hue : 0);
  }, [hue]);

  const handleHueChange = (nextHue: number, updateTouchbar = true): void => {
    let hex: string | 'multi';
    let red: number | 'multi';
    let green: number | 'multi';
    let blue: number | 'multi';
    const newColors = Object.keys(colorValues).reduce((result, current, index) => {
      const colorInstance = tinyColor({h: nextHue, s: colorValues[current].s, l: colorValues[current].l});
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
        [current]: { h: nextHue }
      };
    }, {});
    setHueValue(nextHue);
    setHue(nextHue);
    setHex(hex);
    setRed(red);
    setGreen(green);
    setBlue(blue);
    onChange(newColors);
    // if (updateTouchbar) {
    //   debounceBuildTouchbar(nextHue);
    // }
  }

  // const handleFocus = (e: any): void => {
  //   if (isMac) {
  //     buildTouchBar();
  //   }
  // }

  // const handleBlur = (e: any): void => {
  //   if (isMac) {
  //     clearTouchbar();
  //   }
  // }

  return (
    <div className='c-color-picker__hue'>
      <Form.Control
        ref={controlRef}
        as='input'
        type='range'
        sliderType='hue'
        sliderProps={{thicc: true}}
        size='small'
        min={0}
        max={360}
        step={1}
        onChange={(e: any) => handleHueChange(e.target.value)}
        // onFocus={handleFocus}
        // onBlur={handleBlur}
        value={hueValue} />
    </div>
  );
}

export default ColorPickerHue;