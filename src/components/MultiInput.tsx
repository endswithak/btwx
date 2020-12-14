import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableLayersFill, setLayersFillType, enableLayersStroke, setLayersStrokeFillType } from '../store/actions/layer';
import { getSelectedFillColor, getSelectedFillEnabled, getSelectedShadowColor, getSelectedShadowEnabled, getSelectedStrokeColor, getSelectedStrokeEnabled } from '../store/selectors/layer';
import { openColorEditor } from '../store/actions/colorEditor';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import GradientTypeSelector from './GradientTypeSelector';

interface ColorInputProps {
  prop: 'fill' | 'stroke' | 'shadow';
}

const ColorInput = (props: ColorInputProps): ReactElement => {
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

  const handleSwatchClick = (bounding: DOMRect): void => {
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
        x: bounding.x,
        y: bounding.y - (bounding.height - 10) // 2 (swatch drop shadow) + 8 (top-padding)
      }));
    }
  };

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarSwatch
          isActive={colorEditorOpen}
          style={{
            background: 'none'
          }}
          onClick={handleSwatchClick}
          bottomLabel='Multi'
          multi />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <GradientTypeSelector
          gradientTypeValue={null}
          disabled={true}
          prop='fill' />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={'multi'}
          onChange={null}
          onSubmit={null}
          submitOnBlur
          label={'%'}
          disabled={true}
          bottomLabel={'Opacity'} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default ColorInput;