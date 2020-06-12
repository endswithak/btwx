import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import chroma from 'chroma-js';
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

interface ColorPickerProps {
  colorValue: string;
  colorType: 'hsl' | 'rgb';
  onChange?(color: string): void;
}

const ColorPicker = (props: ColorPickerProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { onChange, colorType, colorValue } = props;
  const [color, setColor] = useState<string>(chroma(colorValue).hex());
  const [hue, setHue] = useState(isNaN(chroma(colorValue).get('hsl.h')) ? 0 : chroma(colorValue).get('hsl.h'));
  const [saturation, setSaturation] = useState(chroma(colorValue).get('hsl.s'));
  const [lightness, setLightness] = useState(chroma(colorValue).get('hsl.l'));
  const [value, setValue] = useState(chroma(colorValue).get('hsv.v'));
  const [alpha, setAlpha] = useState(chroma(colorValue).alpha());
  const [type, setType] = useState(colorType);

  useEffect(() => {
    //setColor(colorValue);
    setHue(isNaN(chroma(colorValue).get('hsl.h')) ? 0 : chroma(colorValue).get('hsl.h'));
    setSaturation(chroma(colorValue).get('hsl.s'));
    setLightness(chroma(colorValue).get('hsl.l'));
    setValue(chroma(colorValue).get('hsv.v'));
    setAlpha(chroma(colorValue).alpha());
    setType(colorType);
  }, [colorValue]);

  useEffect(() => {
    setColor(chroma.hsl(hue, saturation, lightness, alpha).hex());
  }, [hue, saturation, lightness, value, alpha]);

  useEffect(() => {
    onChange(color);
  }, [color]);

  return (
    <div className='c-color-picker'>
      <div className='c-color-picker__saturation'>
        <ColorPickerSaturation
          hue={hue}
          saturation={saturation}
          lightness={lightness}
          value={value}
          setSaturation={setSaturation}
          setValue={setValue}
          setLightness={setLightness} />
      </div>
      <div className='c-color-picker__controls'>
        <div className='c-color-picker__sliders'>
          <ColorPickerHue
            hue={hue}
            setHue={setHue} />
          <ColorPickerAlpha
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            alpha={alpha}
            setAlpha={setAlpha} />
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
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            value={value}
            setHue={setHue}
            setSaturation={setSaturation}
            setLightness={setLightness}
            setValue={setValue} />
        <ColorPickerAlphaInput
          alpha={alpha}
          setAlpha={setAlpha} />
      </div>
      <div className='c-color-picker__fields c-color-picker__fields--rgb'>
        {
          type === 'rgb'
          ? <>
              <ColorPickerRedInput
                hue={hue}
                saturation={saturation}
                lightness={lightness}
                value={value}
                setHue={setHue}
                setSaturation={setSaturation}
                setLightness={setLightness}
                setValue={setValue} />
              <ColorPickerGreenInput
                hue={hue}
                saturation={saturation}
                lightness={lightness}
                value={value}
                setHue={setHue}
                setSaturation={setSaturation}
                setLightness={setLightness}
                setValue={setValue} />
              <ColorPickerBlueInput
                hue={hue}
                saturation={saturation}
                lightness={lightness}
                value={value}
                setHue={setHue}
                setSaturation={setSaturation}
                setLightness={setLightness}
                setValue={setValue} />
            </>
          : <>
              <ColorPickerHueInput
                hueValue={hue}
                setHueValue={setHue} />
              <ColorPickerSaturationInput
                hueValue={hue}
                saturationValue={saturation}
                lightnessValue={lightness}
                setValue={setValue}
                setSaturationValue={setSaturation} />
              <ColorPickerLightnessInput
                hueValue={hue}
                saturationValue={saturation}
                lightnessValue={lightness}
                setValue={setValue}
                setLightnessValue={setLightness} />
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

// interface ColorPickerProps {
//   color: string;
//   onChange?(color: string): void;
// }

// const Picker = styled.div`
//   .sketch-picker {
//     background: none !important;
//     font-family: 'Space Mono' !important;
//     box-shadow: none !important;
//     ::selection {
//       background: ${props => props.theme.palette.primary} !important;
//     }
//   }
//   input {
//     background: ${props => props.theme.background.z4} !important;
//     color: ${props => props.theme.text.base} !important;
//     outline: none !important;
//     border: none !important;
//     box-shadow: none !important;
//     width: 100% !important;
//     font-family: 'Space Mono' !important;
//     border-radius: ${props => props.theme.unit}px !important;
//     ::selection {
//       background: ${props => props.theme.palette.primary} !important;
//     }
//     :focus {
//       box-shadow: 0 0 0 1px ${props => props.theme.palette.primary} !important;
//     }
//   }
//   span {
//     color: ${props => props.theme.text.lighter} !important;
//     ::selection {
//       background: ${props => props.theme.palette.primary} !important;
//     }
//   }
// `;

// const ColorPicker = (props: ColorPickerProps): ReactElement => {
//   const theme = useContext(ThemeContext);
//   const { onChange, color } = props;
//   const [pickerColor, setPickerColor] = useState(color);

//   useEffect(() => {
//     setPickerColor(color);
//   }, [color]);

//   const handleColorChange = (color: any) => {
//     const newColor = chroma(color.rgb).hex();
//     setPickerColor(newColor);
//     if (onChange) {
//       onChange(newColor);
//     }
//   }

//   return (
//     <Picker
//       theme={theme}>
//       <SketchPicker
//         color={pickerColor}
//         onChange={handleColorChange}
//         presetColors={[]} />
//     </Picker>
//   );
// }

// export default ColorPicker;