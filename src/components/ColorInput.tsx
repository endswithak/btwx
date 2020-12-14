import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { getSelectedFillColor, getSelectedFillEnabled, getSelectedFillOpacity, getSelectedShadowColor, getSelectedShadowEnabled, getSelectedShadowOpacity, getSelectedStrokeColor, getSelectedStrokeEnabled, getSelectedStrokeOpacity } from '../store/selectors/layer';
import { enableLayersFill, setLayersFillColor, enableLayersShadow, setLayersShadowColor, enableLayersStroke, setLayersStrokeColor } from '../store/actions/layer';
import { openColorEditor } from '../store/actions/colorEditor';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';

interface ColorInputProps {
  prop: 'fill' | 'stroke' | 'shadow';
}

const ColorInput = (props: ColorInputProps): ReactElement => {
  const { prop } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const textLayerSelected = useSelector((state: RootState) => state.layer.present.selected.some((id: string) => state.layer.present.byId[id].type === 'Text'));
  const colorValue = (() => {
    switch(prop) {
      case 'fill':
        return useSelector((state: RootState) => getSelectedFillColor(state));
      case 'stroke':
        return useSelector((state: RootState) => getSelectedStrokeColor(state));
      case 'shadow':
        return useSelector((state: RootState) => getSelectedShadowColor(state));
    }
  })() as Btwx.Color | 'multi';
  const opacityValue = (() => {
    switch(prop) {
      case 'fill':
        return useSelector((state: RootState) => getSelectedFillOpacity(state));
      case 'stroke':
        return useSelector((state: RootState) => getSelectedStrokeOpacity(state));
      case 'shadow':
        return useSelector((state: RootState) => getSelectedShadowOpacity(state));
    }
  })() as number | 'multi';
  const enabledValue = (() => {
    switch(prop) {
      case 'fill':
        return useSelector((state: RootState) => getSelectedFillEnabled(state));
      case 'stroke':
        return useSelector((state: RootState) => getSelectedStrokeEnabled(state));
      case 'shadow':
        return useSelector((state: RootState) => getSelectedShadowEnabled(state));
    }
  })() as boolean | 'multi';
  const colorEditorOpen = useSelector((state: RootState) => state.colorEditor.isOpen);
  const colorEditorProp = useSelector((state: RootState) => state.colorEditor.prop);
  const [enabled, setEnabled] = useState<boolean | 'multi'>(enabledValue);
  const [color, setColor] = useState<Btwx.Color | 'multi'>(colorValue);
  const [opacity, setOpacity] = useState(opacityValue !== 'multi' ? Math.round(opacityValue * 100) : opacityValue);
  const [hex, setHex] = useState(colorValue !== 'multi' ? tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex() : colorValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setEnabled(enabledValue);
    setColor(colorValue);
    setOpacity(opacityValue !== 'multi' ? Math.round(opacityValue * 100) : opacityValue);
    setHex(colorValue !== 'multi' ? tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex() : colorValue);
  }, [colorValue, opacityValue, selected, enabledValue]);

  const handleOpacityChange = (e: any): void => {
    const target = e.target;
    setOpacity(target.value);
  };

  const handleHexChange = (e: any): void => {
    const target = e.target;
    setHex(target.value);
  };

  const handleOpacitySubmit = (e: any): void => {
    try {
      let nextOpacity = mexp.eval(`${opacity}`) as any;
      if (nextOpacity !== opacityValue) {
        if (nextOpacity > 100) {
          nextOpacity = 100;
        }
        if (nextOpacity < 0) {
          nextOpacity = 0;
        }
        const nextAlpha = { a: nextOpacity / 100 } as Btwx.Color;
        switch(prop) {
          case 'fill':
            dispatch(setLayersFillColor({layers: selected, fillColor: nextAlpha}));
            break;
          case 'stroke':
            dispatch(setLayersStrokeColor({layers: selected, strokeColor: nextAlpha}));
            break;
          case 'shadow':
            dispatch(setLayersShadowColor({layers: selected, shadowColor: nextAlpha}));
            break;
        }
      } else {
        setOpacity(opacityValue !== 'multi' ? Math.round(opacityValue * 100) : opacityValue);
      }
    } catch(error) {
      setOpacity(opacityValue !== 'multi' ? Math.round(opacityValue * 100) : opacityValue);
    }
  }

  const handleHexSubmit = (e: any): void => {
    const nextHex = tinyColor(hex);
    if (nextHex.isValid()) {
      const hsl = nextHex.toHsl();
      const hsv = nextHex.toHsv();
      const nextColor = { h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v } as Btwx.Color;
      switch(prop) {
        case 'fill': {
          dispatch(setLayersFillColor({layers: selected, fillColor: nextColor}));
          if (textLayerSelected) {
            dispatch(setTextSettingsFillColor({fillColor: nextColor}));
          }
          break;
        }
        case 'stroke':
          dispatch(setLayersStrokeColor({layers: selected, strokeColor: nextColor}));
          break;
        case 'shadow':
          dispatch(setLayersShadowColor({layers: selected, shadowColor: nextColor}));
          break;
      }
    } else {
      setHex(colorValue !== 'multi' ? tinyColor({h: colorValue.h, s: colorValue.s, l: colorValue.l}).toHex() : colorValue);
    }
  };

  const handleSwatchClick = (bounding: DOMRect): void => {
    if (!enabled || enabled === 'multi') {
      switch(prop) {
        case 'fill':
          dispatch(enableLayersFill({layers: selected}));
          break;
        case 'stroke':
          dispatch(enableLayersStroke({layers: selected}));
          break;
        case 'shadow':
          dispatch(enableLayersShadow({layers: selected}));
          break;
      }
    }
    if (!colorEditorOpen) {
      dispatch(openColorEditor({
        prop: prop,
        x: bounding.x,
        y: bounding.y - (bounding.height - 10) // 2 (swatch drop shadow) + 8 (top-padding)
      }));
    }
  };

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarSwatch
          isActive={colorEditorOpen && colorEditorProp === prop}
          style={{
            background: color !== 'multi' ? tinyColor(color).toHslString() : 'none'
          }}
          onClick={handleSwatchClick}
          bottomLabel='Color'
          multi={color === 'multi'} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={hex}
          onChange={handleHexChange}
          onSubmit={handleHexSubmit}
          submitOnBlur
          disabled={!enabled || enabled === 'multi'}
          leftLabel={'#'}
          bottomLabel={'Hex'} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={opacity}
          onChange={handleOpacityChange}
          onSubmit={handleOpacitySubmit}
          submitOnBlur
          label={'%'}
          disabled={!enabled || enabled === 'multi'}
          bottomLabel={'Opacity'} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default ColorInput;