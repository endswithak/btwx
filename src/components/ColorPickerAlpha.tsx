/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { remote } from 'electron';
import { clearTouchbar } from '../utils';
import Form from './Form';

interface ColorPickerAlphaProps {
  hue: number | 'multi';
  saturation: number | 'multi';
  lightness: number | 'multi';
  alpha: number | 'multi';
  colorValues: {
    [id: string]: Btwx.Color;
  };
  setAlpha(alpha: number): void;
  onChange(colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void;
}

const ColorPickerAlpha = (props: ColorPickerAlphaProps): ReactElement => {
  const controlRef = useRef(null);
  const { hue, saturation, lightness, alpha, colorValues, setAlpha, onChange } = props;
  const [alphaValue, setAlphaValue] = useState(alpha !== 'multi' ? alpha : 1);

  const isMac = remote.process.platform === 'darwin';

  const debounceBuildTouchbar = useCallback(
    debounce((nextAlpha: number) => {
      buildTouchBar(nextAlpha);
    }, 150),
    []
  );

  const buildTouchBar = (opt = alphaValue as any): void => {
    const { TouchBarSlider } = remote.TouchBar;
    const radiusSlider = new TouchBarSlider({
      label: 'Alpha',
      value: opt * 100,
      minValue: 0,
      maxValue: 100,
      change: (newValue): void => {
        setAlphaValue(newValue / 100);
        setAlpha(newValue / 100);
        onChange(Object.keys(colorValues).reduce((result, current) => ({
          ...result,
          [current]: { a: newValue / 100 }
        }), {}));
      }
    });
    const newTouchBar = new remote.TouchBar({
      items: [radiusSlider]
    });
    remote.getCurrentWindow().setTouchBar(newTouchBar);
  }

  useEffect(() => {
    setAlphaValue(alpha !== 'multi' ? alpha : 1);
  }, [alpha]);

  const handleChange = (e: any) => {
    const target = e.target;
    setAlphaValue(target.value);
    setAlpha(target.value);
    onChange(Object.keys(colorValues).reduce((result, current) => ({
      ...result,
      [current]: { a: target.value }
    }), {}));
    debounceBuildTouchbar(target.value);
  };

  const handleFocus = (e: any): void => {
    if (isMac) {
      buildTouchBar();
    }
  }

  const handleBlur = (e: any): void => {
    if (isMac) {
      clearTouchbar();
    }
  }

  return (
    <div className='c-color-picker__alpha'>
      <Form.Control
        ref={controlRef}
        as='input'
        type='range'
        sliderType='alpha'
        sliderProps={{hue, saturation, lightness, thicc: true}}
        size='small'
        min={0}
        max={1}
        step={0.01}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={alphaValue} />
    </div>
  );
}

export default ColorPickerAlpha;