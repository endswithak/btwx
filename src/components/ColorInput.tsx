import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import tinyColor from 'tinycolor2';
import gsap from 'gsap';
import { RootState } from '../store/reducers';
import { getSelectedFillColor, getSelectedFillHex, getSelectedFillEnabled, getSelectedFillOpacity, getSelectedShadowColor, getSelectedShadowHex, getSelectedShadowEnabled, getSelectedShadowOpacity, getSelectedStrokeColor, getSelectedStrokeHex, getSelectedStrokeEnabled, getSelectedStrokeOpacity } from '../store/selectors/layer';
import { enableLayersFill, setLayersFillColor, enableLayersShadow, setLayersShadowColor, enableLayersStroke, setLayersStrokeColor, setLayersFill, setLayersStroke } from '../store/actions/layer';
import { enableDraggingFill, disableDraggingFill, enableDraggingStroke, disableDraggingStroke, enableDraggingShadow, disableDraggingShadow, enableFillDragover, disableFillDragover, enableStrokeDragover, disableStrokeDragover } from '../store/actions/rightSidebar';
import { openColorEditor } from '../store/actions/colorEditor';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import HexFormGroup from './HexFormGroup';
import PercentageFormGroup from './PercentageFormGroup';
import Form from './Form';
import fillDropperCursor from '../../assets/cursor/fill-dropper.svg';
import strokeDropperCursor from '../../assets/cursor/stroke-dropper.svg';
import shadowDropperCursor from '../../assets/cursor/shadow-dropper.svg';

interface ColorInputProps {
  prop: 'fill' | 'stroke' | 'shadow';
}

const ColorInput = (props: ColorInputProps): ReactElement => {
  const colorControlRef = useRef(null);
  const hexFormControlRef = useRef(null);
  const opacityTextInputRef = useRef(null);
  const { prop } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const draggingFill = useSelector((state: RootState) => state.rightSidebar.draggingFill);
  const draggingStroke = useSelector((state: RootState) => state.rightSidebar.draggingStroke);
  // const fillDragover = useSelector((state: RootState) => state.rightSidebar.fillDragover);
  // const strokeDragover = useSelector((state: RootState) => state.rightSidebar.strokeDragover);
  // const shadowDragover = useSelector((state: RootState) => state.rightSidebar.shadowDragover);
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
  const [activeDragover, setActiveDragover] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setEnabled(enabledValue);
    setColor(colorValue);
  }, [colorValue, selected, enabledValue]);

  const handleOpacitySubmitSuccess = (nextOpacity: any): void => {
    switch(prop) {
      case 'fill':
        dispatch(setLayersFillColor({
          layers: selected,
          fillColor: { a: nextOpacity } as Btwx.Color
        }));
        break;
      case 'stroke':
        dispatch(setLayersStrokeColor({
          layers: selected,
          strokeColor: { a: nextOpacity } as Btwx.Color
        }));
        break;
      case 'shadow':
        dispatch(setLayersShadowColor({
          layers: selected,
          shadowColor: { a: nextOpacity } as Btwx.Color
        }));
        break;
    }
  }

  const handleHexSubmitSuccess = (nextHex: any): void => {
    const hsl = tinyColor(nextHex).toHsl();
    const nextColor = { h: hsl.h, s: hsl.s, l: hsl.l } as Btwx.Color;
    switch(prop) {
      case 'fill': {
        dispatch(setLayersFillColor({
          layers: selected,
          fillColor: nextColor
        }));
        if (textLayerSelected) {
          dispatch(setTextSettingsFillColor({
            fillColor: nextColor
          }));
        }
        break;
      }
      case 'stroke':
        dispatch(setLayersStrokeColor({
          layers: selected,
          strokeColor: nextColor
        }));
        break;
      case 'shadow':
        dispatch(setLayersShadowColor({
          layers: selected,
          shadowColor: nextColor
        }));
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
          dispatch(enableLayersFill({
            layers: selected
          }));
          break;
        case 'stroke':
          dispatch(enableLayersStroke({
            layers: selected
          }));
          break;
        case 'shadow':
          dispatch(enableLayersShadow({
            layers: selected
          }));
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

  const handleDragStart = (e: any): void => {
    if (colorValue !== 'multi') {
      switch(prop) {
        case 'fill':
          dispatch(enableDraggingFill({
            fill: {
              color: colorValue,
              enabled: true,
              fillType: 'color'
            }
          }));
          break;
        case 'stroke':
          dispatch(enableDraggingStroke({
            stroke: {
              color: colorValue,
              enabled: true,
              fillType: 'color'
            }
          }));
          break;
        case 'shadow':
          dispatch(enableDraggingShadow({
            shadow: {
              color: colorValue,
              enabled: true
            }
          }));
          break;
      }
      gsap.set(colorControlRef.current, {
        cursor: `url(${prop === 'fill' ? fillDropperCursor : prop === 'stroke' ? strokeDropperCursor : shadowDropperCursor}) 14 14, auto`
      });
    }
  };

  const handleDragEnd = (e: any): void => {
    if (draggingFill || draggingStroke) {
      switch(prop) {
        case 'fill':
          dispatch(disableDraggingFill());
          setActiveDragover(false);
          break;
        case 'stroke':
          dispatch(disableDraggingStroke());
          setActiveDragover(false);
          break;
        case 'shadow':
          dispatch(disableDraggingShadow());
          setActiveDragover(false);
          break;
      }
      gsap.set(colorControlRef.current, {
        clearProps: 'all'
      });
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    if ((draggingFill || draggingStroke) && !activeDragover) {
      switch(prop) {
        case 'fill':
          if (draggingStroke) {
            dispatch(enableFillDragover());
            setActiveDragover(true);
          }
          break;
        case 'stroke':
          if (draggingFill) {
            dispatch(enableStrokeDragover());
            setActiveDragover(true);
          }
          break;
      }
    }
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    if (draggingFill || draggingStroke) {
      switch(prop) {
        case 'fill':
          if (draggingStroke) {
            dispatch(disableFillDragover());
            setActiveDragover(false);
          }
          break;
        case 'stroke':
          if (draggingFill) {
            dispatch(disableStrokeDragover());
            setActiveDragover(false);
          }
          break;
      }
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    if (draggingFill || draggingStroke) {
      switch(prop) {
        case 'fill':
          if (draggingStroke) {
            dispatch(setLayersFill({
              layers: selected,
              fill: draggingStroke as any
            }));
          }
          break;
        case 'stroke':
          if (draggingFill) {
            dispatch(setLayersStroke({
              layers: selected,
              stroke: draggingFill as any
            }));
          }
          break;
      }
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
              draggable={colorValue !== 'multi'}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isActive={colorEditorOpen && colorEditorProp === prop}
              thiccActive={activeDragover}
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