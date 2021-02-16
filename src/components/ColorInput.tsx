import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { getSelectedFillColor, getSelectedFillHex, getSelectedFillEnabled, getSelectedFillOpacity, getSelectedShadowColor, getSelectedShadowHex, getSelectedShadowEnabled, getSelectedShadowOpacity, getSelectedStrokeColor, getSelectedStrokeHex, getSelectedStrokeEnabled, getSelectedStrokeOpacity } from '../store/selectors/layer';
import { enableLayersFill, setLayersFillColor, enableLayersShadow, setLayersShadowColor, enableLayersStroke, setLayersStrokeColor } from '../store/actions/layer';
import { openColorEditor } from '../store/actions/colorEditor';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import HexFormGroup from './HexFormGroup';
import PercentageFormGroup from './PercentageFormGroup';
import Form from './Form';

interface ColorInputProps {
  prop: 'fill' | 'stroke' | 'shadow';
}

const ColorInput = (props: ColorInputProps): ReactElement => {
  const colorControlRef = useRef(null);
  const hexFormControlRef = useRef(null);
  const opacityTextInputRef = useRef(null);
  const { prop } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const textLayerSelected = useSelector((state: RootState) => state.layer.present.selected.some((id: string) => state.layer.present.byId[id].type === 'Text'));
  const colorValue: Btwx.Color | 'multi' = useSelector((state: RootState) => {
    switch(prop) {
      case 'fill':
        return getSelectedFillColor(state);
      case 'stroke':
        return getSelectedStrokeColor(state);
      case 'shadow':
        return getSelectedShadowColor(state);
    }
  });
  const hexValue: string | 'multi' = useSelector((state: RootState) => {
    switch(prop) {
      case 'fill':
        return getSelectedFillHex(state);
      case 'stroke':
        return getSelectedStrokeHex(state);
      case 'shadow':
        return getSelectedShadowHex(state);
    }
  });
  const opacityValue: number | 'multi' = useSelector((state: RootState) => {
    switch(prop) {
      case 'fill':
        return getSelectedFillOpacity(state);
      case 'stroke':
        return getSelectedStrokeOpacity(state);
      case 'shadow':
        return getSelectedShadowOpacity(state);
    }
  });
  const enabledValue: boolean | 'multi' = useSelector((state: RootState) => {
    switch(prop) {
      case 'fill':
        return getSelectedFillEnabled(state);
      case 'stroke':
        return getSelectedStrokeEnabled(state);
      case 'shadow':
        return getSelectedShadowEnabled(state);
    }
  });
  const colorEditorOpen = useSelector((state: RootState) => state.colorEditor.isOpen);
  const colorEditorProp = useSelector((state: RootState) => state.colorEditor.prop);
  const [enabled, setEnabled] = useState<boolean | 'multi'>(enabledValue);
  const [color, setColor] = useState<Btwx.Color | 'multi'>(colorValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setEnabled(enabledValue);
    setColor(colorValue);
  }, [colorValue, selected, enabledValue]);

  const handleOpacitySubmitSuccess = (nextOpacity: any): void => {
    switch(prop) {
      case 'fill':
        dispatch(setLayersFillColor({layers: selected, fillColor: { a: nextOpacity } as Btwx.Color}));
        break;
      case 'stroke':
        dispatch(setLayersStrokeColor({layers: selected, strokeColor: { a: nextOpacity } as Btwx.Color}));
        break;
      case 'shadow':
        dispatch(setLayersShadowColor({layers: selected, shadowColor: { a: nextOpacity } as Btwx.Color}));
        break;
    }
  }

  const handleHexSubmitSuccess = (nextHex: any): void => {
    const hsl = tinyColor(nextHex).toHsl();
    const nextColor = { h: hsl.h, s: hsl.s, l: hsl.l } as Btwx.Color;
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
  };

  const handleSwatchClick = (e: any): void => {
    e.preventDefault();
    const sidebarRightScroll = document.getElementById('sidebar-scroll-right');
    const controlBox = colorControlRef.current.getBoundingClientRect();
    const sidebarBox = sidebarRightScroll.getBoundingClientRect();
    const scrollTop = sidebarRightScroll.scrollTop;
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
        x: controlBox.x,
        y: (controlBox.y + scrollTop + controlBox.height) - sidebarBox.top
      }));
    }
  };

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'33.33%'}>
        <Form inline>
          <Form.Group controlId={`control-${prop}-color-swatch`}>
            <Form.Control
              ref={colorControlRef}
              type='color'
              size='small'
              isActive={colorEditorOpen && colorEditorProp === prop}
              multiColor={hexValue === 'multi'}
              value={`#${hexValue}`}
              onChange={() => { return; }}
              onClick={handleSwatchClick} />
            <Form.Label>
              Color
            </Form.Label>
          </Form.Group>
        </Form>
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <HexFormGroup
          ref={hexFormControlRef}
          controlId={`control-${prop}-color-hex`}
          value={hexValue}
          onSubmitSuccess={handleHexSubmitSuccess}
          disabled={!enabled || enabled === 'multi'}
          canvasAutoFocus
          submitOnBlur
          size='small'
          label='Hex' />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <PercentageFormGroup
          controlId={`control-${prop}-color-opacity`}
          value={opacityValue}
          ref={opacityTextInputRef}
          disabled={!enabled || enabled === 'multi'}
          canvasAutoFocus
          submitOnBlur
          size='small'
          onSubmitSuccess={handleOpacitySubmitSuccess}
          label='Opacity' />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default ColorInput;