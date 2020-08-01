import paper from 'paper';
import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import { RootState } from '../store/reducers';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import GradientTypeSelector from './GradientTypeSelector';
import { EnableLayerFillPayload, EnableLayerStrokePayload, SetLayerFillGradientPayload, SetLayerStrokeGradientPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerFill, enableLayerStroke, setLayerFillGradient, setLayerStrokeGradient } from '../store/actions/layer';
import { OpenGradientEditorPayload, GradientEditorTypes } from '../store/actionTypes/gradientEditor';
import { openGradientEditor } from '../store/actions/gradientEditor';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import tinyColor from 'tinycolor2';

interface GradientInputProps {
  prop: 'fill' | 'stroke';
  enabledValue?: boolean;
  selected?: string[];
  gradientValue?: em.Gradient;
  gradientOpacity?: number;
  isGradientEditorOpen?: boolean;
  stopById?: {
    [id: string]: em.GradientStop;
  };
  cssGradient?: string;
  enableLayerFill?(payload: EnableLayerFillPayload): LayerTypes;
  enableLayerStroke?(payload: EnableLayerStrokePayload): LayerTypes;
  setLayerFillGradient?(payload: SetLayerFillGradientPayload): LayerTypes;
  setLayerStrokeGradient?(payload: SetLayerStrokeGradientPayload): LayerTypes;
  openGradientEditor?(payload: OpenGradientEditorPayload): GradientEditorTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
}

const GradientInput = (props: GradientInputProps): ReactElement => {
  const { prop, enabledValue, stopById, selected, gradientValue, gradientOpacity, isGradientEditorOpen, enableLayerFill, enableLayerStroke, setLayerFillGradient, setLayerStrokeGradient, cssGradient, openGradientEditor } = props;
  const [enabled, setEnabled] = useState<boolean>(enabledValue);
  const [gradient, setGradient] = useState(gradientValue);
  const [opacity, setOpacity] = useState<number | string>(gradientOpacity);

  useEffect(() => {
    setEnabled(enabledValue);
    setGradient(gradientValue);
    setOpacity(gradientOpacity);
  }, [gradientValue, selected, gradientOpacity, stopById, enabledValue]);

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
                color: {
                  ...gradient.stops.byId[current].color,
                  a: nextOpacity / 100
                }
              }
              return result;
            }, {})
          }
        }
        switch(prop) {
          case 'fill':
            setLayerFillGradient({id: selected[0], gradient: newGradient});
            break;
          case 'stroke':
            setLayerStrokeGradient({id: selected[0], gradient: newGradient});
            break;
        }
      } else {
        setOpacity(gradientOpacity);
      }
    } catch(error) {
      setOpacity(gradientOpacity);
    }
  }

  const handleSwatchClick = (bounding: DOMRect): void => {
    if (!enabled) {
      switch(prop) {
        case 'fill':
          enableLayerFill({id: selected[0]});
          break;
        case 'stroke':
          enableLayerStroke({id: selected[0]});
          break;
      }
    }
    if (!isGradientEditorOpen) {
      openGradientEditor({
        prop: prop,
        gradient: gradientValue,
        layer: selected[0],
        x: bounding.x,
        y: bounding.y - (bounding.height - 10) // 2 (swatch drop shadow) + 8 (top-padding)
      });
    }
  };

  return (
    <SidebarSectionRow alignItems='center'>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarSwatch
          isActive={isGradientEditorOpen}
          style={{
            background: cssGradient
          }}
          onClick={handleSwatchClick}
          bottomLabel='Gradient' />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <GradientTypeSelector
          gradientTypeValue={gradient.gradientType}
          disabled={selected.length > 1 || selected.length === 0 || !enabled}
          prop='fill' />
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

const mapStateToProps = (state: RootState, ownProps: GradientInputProps) => {
  const { layer, gradientEditor } = state;
  const layerItem = layer.present.byId[layer.present.selected[0]];
  const style = (() => {
    switch(ownProps.prop) {
      case 'fill':
        return layerItem.style.fill;
      case 'stroke':
        return layerItem.style.stroke;
    }
  })();
  const enabledValue = style.enabled;
  const selected = layer.present.selected;
  const gradientValue = style.gradient;
  const stops = gradientValue.stops;
  const gradientOpacity = stops.allIds.every((stop) => stops.byId[stop].color.a === stops.byId[stops.allIds[0]].color.a) ? Math.round(stops.byId[stops.allIds[0]].color.a * 100) : 'multi';
  const isGradientEditorOpen = gradientEditor.isOpen;
  const stopById = stops.byId;
  const sorted = Object.keys(stopById).sort((a,b) => { return stopById[a].position - stopById[b].position });
  const cssGradient = sorted.reduce((result, current, index) => {
    const stopItem = stops.byId[current];
    const stopColor = tinyColor({h: stopItem.color.h, s: stopItem.color.s, l: stopItem.color.l, a: stopItem.color.a}).toHslString();
    result = result + `${stopColor} ${stopItem.position * 100}%`;
    if (index !== stops.allIds.length - 1) {
      result = result + ',';
    } else {
      result = result + ')';
    }
    return result;
  }, `linear-gradient(to right,`);
  return { enabledValue, selected, gradientValue, gradientOpacity, isGradientEditorOpen, stopById, cssGradient };
};

export default connect(
  mapStateToProps,
  {
    enableLayerFill,
    enableLayerStroke,
    setLayerFillGradient,
    setLayerStrokeGradient,
    setTextSettingsFillColor,
    openGradientEditor
  }
)(GradientInput);