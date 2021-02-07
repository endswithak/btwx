import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableLayersFill, setLayersFillType, enableLayersStroke, setLayersStrokeFillType } from '../store/actions/layer';
import { getSelectedFillColor, getSelectedFillEnabled, getSelectedShadowColor, getSelectedShadowEnabled, getSelectedStrokeColor, getSelectedStrokeEnabled } from '../store/selectors/layer';
import { openColorEditor } from '../store/actions/colorEditor';
import PercentageFormGroup from './PercentageFormGroup';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import Form from './Form';
import GradientTypeSelector from './GradientTypeSelector';

interface ColorInputProps {
  prop: 'fill' | 'stroke' | 'shadow';
}

const ColorInput = (props: ColorInputProps): ReactElement => {
  const colorControlRef = useRef(null);
  const opacityFormControlRef = useRef(null);
  const { prop } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
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
  const [enabled, setEnabled] = useState<boolean | 'multi'>(enabledValue);
  const [color, setColor] = useState<Btwx.Color | 'multi'>(colorValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setEnabled(enabledValue);
    setColor(colorValue);
  }, [colorValue, selected, enabledValue]);

  const handleSwatchClick = (e: any): void => {
    e.preventDefault();
    const sidebarRightScroll = document.getElementById('sidebar-scroll-right');
    const controlBox = colorControlRef.current.getBoundingClientRect();
    const sidebarBox = sidebarRightScroll.getBoundingClientRect();
    const scrollTop = sidebarRightScroll.scrollTop;
    switch(prop) {
      case 'fill':
        dispatch(setLayersFillType({layers: selected, fillType: 'color'}));
        break;
      case 'stroke':
        dispatch(setLayersStrokeFillType({layers: selected, fillType: 'color'}));
        break;
    }
    if (!enabled || enabled === 'multi') {
      switch(prop) {
        case 'fill':
          dispatch(enableLayersFill({layers: selected}));
          break;
        case 'stroke':
          dispatch(enableLayersStroke({layers: selected}));
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
          <Form.Group controlId={`control-multi-color-swatch`}>
            <Form.Control
              ref={colorControlRef}
              type='color'
              size='small'
              isActive={colorEditorOpen}
              multiColor
              value=''
              onChange={() => {}}
              onClick={handleSwatchClick} />
            <Form.Label>
              Multi
            </Form.Label>
          </Form.Group>
        </Form>
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <GradientTypeSelector
          gradientTypeValue={null}
          disabled={true}
          prop='fill' />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <PercentageFormGroup
          controlId={`control-multi-opacity`}
          value='multi'
          ref={opacityFormControlRef}
          disabled
          canvasAutoFocus
          submitOnBlur
          size='small'
          onSubmitSuccess={null}
          label='Opacity' />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default ColorInput;