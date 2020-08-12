import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { colorsMatch } from '../store/selectors/layer';
import { EnableLayersFillPayload, SetLayersFillTypePayload, EnableLayersStrokePayload, SetLayersStrokeFillTypePayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayersFill, setLayersFillType, enableLayersStroke, setLayersStrokeFillType } from '../store/actions/layer';
import { OpenColorEditorPayload, ColorEditorTypes } from '../store/actionTypes/colorEditor';
import { openColorEditor } from '../store/actions/colorEditor';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import GradientTypeSelector from './GradientTypeSelector';

interface ColorInputProps {
  prop: 'fill' | 'stroke' | 'shadow';
  enabledValue?: boolean | 'multi';
  selected?: string[];
  colorValue?: em.Color | 'multi';
  opacityValue?: number | 'multi';
  colorEditorOpen?: boolean;
  openColorEditor?(payload: OpenColorEditorPayload): ColorEditorTypes;
  enableLayersFill?(payload: EnableLayersFillPayload): LayerTypes;
  enableLayersStroke?(payload: EnableLayersStrokePayload): LayerTypes;
  setLayersFillType?(payload: SetLayersFillTypePayload): LayerTypes;
  setLayersStrokeFillType?(payload: SetLayersStrokeFillTypePayload): LayerTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
}

const ColorInput = (props: ColorInputProps): ReactElement => {
  const { prop, enabledValue, selected, colorValue, opacityValue, colorEditorOpen, enableLayersFill, enableLayersStroke, openColorEditor, setTextSettingsFillColor, setLayersFillType, setLayersStrokeFillType } = props;
  const [enabled, setEnabled] = useState<boolean | 'multi'>(enabledValue);
  const [color, setColor] = useState<em.Color | 'multi'>(colorValue);

  useEffect(() => {
    setEnabled(enabledValue);
    setColor(colorValue);
  }, [colorValue, opacityValue, selected, enabledValue]);

  const handleSwatchClick = (bounding: DOMRect): void => {
    switch(prop) {
      case 'fill':
        setLayersFillType({layers: selected, fillType: 'color'});
        break;
      case 'stroke':
        setLayersStrokeFillType({layers: selected, fillType: 'color'});
        break;
    }
    if (!enabled || enabled === 'multi') {
      switch(prop) {
        case 'fill':
          enableLayersFill({layers: selected});
          break;
        case 'stroke':
          enableLayersStroke({layers: selected});
          break;
      }
    }
    if (!colorEditorOpen) {
      openColorEditor({
        prop: prop,
        layers: selected,
        x: bounding.x,
        y: bounding.y - (bounding.height - 10) // 2 (swatch drop shadow) + 8 (top-padding)
      });
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
          onChange={() => {}}
          onSubmit={() => {}}
          submitOnBlur
          label={'%'}
          disabled={true}
          bottomLabel={'Opacity'} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

const mapStateToProps = (state: RootState, ownProps: ColorInputProps): {
  enabledValue: boolean | 'multi';
  selected: string[];
  colorValue: em.Color | 'multi';
  colorEditorOpen: boolean;
} => {
  const { layer, colorEditor } = state;
  const selected = layer.present.selected;
  const layerItems: em.Layer[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const styleValues: (em.Fill | em.Stroke | em.Shadow)[] = layerItems.reduce((result, current) => {
    switch(ownProps.prop) {
      case 'fill':
        return [...result, current.style.fill];
      case 'stroke':
        return [...result, current.style.stroke];
      case 'shadow':
        return [...result, current.style.shadow];
    }
  }, []);
  const colorValue = ((): em.Color | 'multi' => {
    if (styleValues.every((value: em.Fill | em.Stroke | em.Shadow) => colorsMatch(value.color, styleValues[0].color))) {
      return styleValues[0].color;
    } else {
      return 'multi';
    }
  })();
  const enabledValue = ((): boolean | 'multi' => {
    if (styleValues.every((value: em.Fill | em.Stroke | em.Shadow) => value.enabled === styleValues[0].enabled)) {
      return styleValues[0].enabled;
    } else {
      return 'multi';
    }
  })();
  const colorEditorOpen = colorEditor.isOpen;
  return { enabledValue, selected, colorValue, colorEditorOpen };
};

export default connect(
  mapStateToProps,
  {
    setLayersFillType,
    setLayersStrokeFillType,
    enableLayersFill,
    enableLayersStroke,
    openColorEditor,
    setTextSettingsFillColor,
  }
)(ColorInput);