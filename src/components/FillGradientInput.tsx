import paper from 'paper';
import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import chroma from 'chroma-js';
import { RootState } from '../store/reducers';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import GradientTypeSelector from './GradientTypeSelector';
import { EnableLayerFillPayload, SetLayerFillGradientPayload, SetLayerFillColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerFill, setLayerFillGradient, setLayerFillColor } from '../store/actions/layer';
import { OpenFillLinearGradientEditorPayload, FillLinearGradientEditorTypes } from '../store/actionTypes/fillLinearGradientEditor';
import { openFillLinearGradientEditor } from '../store/actions/fillLinearGradientEditor';
import { OpenFillRadialGradientEditorPayload, FillRadialGradientEditorTypes } from '../store/actionTypes/fillRadialGradientEditor';
import { openFillRadialGradientEditor } from '../store/actions/fillRadialGradientEditor';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';

interface FillGradientInputProps {
  fillEnabled?: boolean;
  selected: string[];
  gradientValue?: em.Gradient;
  gradientOpacity: number;
  isLinearGradientEditorOpen?: boolean;
  isRadialGradientEditorOpen?: boolean;
  stopById?: {
    [id: string]: em.GradientStop;
  };
  cssGradient?: string;
  enableLayerFill?(payload: EnableLayerFillPayload): LayerTypes;
  setLayerFillColor?(payload: SetLayerFillColorPayload): LayerTypes;
  setLayerFillGradient?(payload: SetLayerFillGradientPayload): LayerTypes;
  openFillLinearGradientEditor?(payload: OpenFillLinearGradientEditorPayload): FillLinearGradientEditorTypes;
  openFillRadialGradientEditor?(payload: OpenFillRadialGradientEditorPayload): FillRadialGradientEditorTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
}

const FillGradientInput = (props: FillGradientInputProps): ReactElement => {
  const { fillEnabled, stopById, selected, gradientValue, gradientOpacity, isLinearGradientEditorOpen, isRadialGradientEditorOpen, enableLayerFill, setLayerFillGradient, openFillLinearGradientEditor, openFillRadialGradientEditor, cssGradient } = props;
  const [enabled, setEnabled] = useState<boolean>(fillEnabled);
  const [gradient, setGradient] = useState(gradientValue);
  const [opacity, setOpacity] = useState<number | string>(gradientOpacity);

  useEffect(() => {
    setEnabled(fillEnabled);
    setGradient(gradientValue);
    setOpacity(gradientOpacity);
  }, [gradientValue, selected, gradientOpacity, stopById]);

  const handleOpacityChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  const handleOpacitySubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    try {
      let nextOpacity = evaluate(`${opacity}`);
      if (nextOpacity  !== gradientOpacity && !isNaN(nextOpacity)) {
        if (nextOpacity > 100) {
          nextOpacity = 100;
        }
        if (nextOpacity < 0) {
          nextOpacity = 0;
        }
        const newGradient = {
          ...gradient,
          stops: {
            ...gradient.stops,
            byId: Object.keys(gradient.stops.byId).reduce((result: { [id: string]: em.GradientStop }, current) => {
              result[current] = {
                ...gradient.stops.byId[current],
                color: chroma(gradient.stops.byId[current].color).alpha(nextOpacity / 100).hex()
              }
              return result;
            }, {})
          }
        }
        setLayerFillGradient({id: selected[0], gradient: newGradient});
      } else {
        setOpacity(gradientOpacity);
      }
    } catch(error) {
      setOpacity(gradientOpacity);
    }
  }

  const handleSwatchClick = (bounding: DOMRect): void => {
    if (!enabled) {
      enableLayerFill({id: selected[0]});
    }
    switch(gradientValue.gradientType) {
      case 'linear':
        if (!isLinearGradientEditorOpen) {
          openFillLinearGradientEditor({
            gradient: gradientValue,
            layer: selected[0],
            x: bounding.x,
            y: bounding.y - (bounding.height - 10) // 2 (swatch drop shadow) + 8 (top-padding)
          });
        }
        break;
      case 'radial':
        if (!isRadialGradientEditorOpen) {
          openFillRadialGradientEditor({
            gradient: gradientValue,
            layer: selected[0],
            x: bounding.x,
            y: bounding.y - (bounding.height - 10) // 2 (swatch drop shadow) + 8 (top-padding)
          });
        }
        break;
    }
  };

  return (
    <SidebarSectionRow alignItems='center'>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarSwatch
          isActive={isLinearGradientEditorOpen || isRadialGradientEditorOpen}
          style={{
            background: cssGradient
          }}
          onClick={handleSwatchClick}
          bottomLabel='Gradient' />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <GradientTypeSelector
          gradientTypeValue={gradient.gradientType}
          disabled={selected.length > 1 || selected.length === 0 || !enabled} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={opacity}
          onChange={handleOpacityChange}
          onSubmit={handleOpacitySubmit}
          submitOnBlur
          label={'%'}
          disabled={selected.length > 1 || selected.length === 0 || !enabled}
          bottomLabel={'Opacity'} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, fillLinearGradientEditor, fillRadialGradientEditor } = state;
  const fillEnabled = layer.present.byId[layer.present.selected[0]].style.fill.enabled;
  const selected = layer.present.selected;
  const gradientValue = layer.present.byId[layer.present.selected[0]].style.fill.gradient;
  const stops = gradientValue.stops;
  const gradientOpacity = stops.allIds.every((stop) => chroma(stops.byId[stop].color).alpha() === chroma(stops.byId[stops.allIds[0]].color).alpha()) ? chroma(stops.byId[stops.allIds[0]].color).alpha() * 100 : 'multi';
  const isLinearGradientEditorOpen = fillLinearGradientEditor.isOpen;
  const isRadialGradientEditorOpen = fillRadialGradientEditor.isOpen;
  const stopById = stops.byId;
  const sorted = Object.keys(stopById).sort((a,b) => { return stopById[a].position - stopById[b].position });
  const cssGradient = sorted.reduce((result, current, index) => {
    result = result + `${stopById[current].color} ${stopById[current].position * 100}%`;
    if (index !== stops.allIds.length - 1) {
      result = result + ',';
    } else {
      result = result + ')';
    }
    return result;
  }, `linear-gradient(to right,`);
  return { fillEnabled, selected, gradientValue, gradientOpacity, isLinearGradientEditorOpen, isRadialGradientEditorOpen, stopById, cssGradient };
};

export default connect(
  mapStateToProps,
  {
    enableLayerFill,
    setLayerFillGradient,
    setTextSettingsFillColor,
    setLayerFillColor,
    openFillLinearGradientEditor,
    openFillRadialGradientEditor
  }
)(FillGradientInput);