import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { EnableLayersFillPayload, EnableLayersStrokePayload, SetLayersGradientPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayersFill, enableLayersStroke, setLayersGradient } from '../store/actions/layer';
import { OpenGradientEditorPayload, GradientEditorTypes } from '../store/actionTypes/gradientEditor';
import { openGradientEditor } from '../store/actions/gradientEditor';
import { getSelectedFillEnabled, getSelectedStrokeEnabled, getSelectedFillGradientType, getSelectedStrokeGradientType, getSelectedFillGradient, getSelectedStrokeGradient } from '../store/selectors/layer';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import GradientTypeSelector from './GradientTypeSelector';

interface GradientInputProps {
  prop: 'fill' | 'stroke';
  displayGradient?: Btwx.Gradient | 'multi';
  gradientTypeValue?: Btwx.GradientType | 'multi';
  enabledValue?: boolean | 'multi';
  selected?: string[];
  gradientValue?: Btwx.Gradient;
  gradientOpacity?: number | 'multi';
  gradientEditorOpen?: boolean;
  gradientEditorProp?: 'fill' | 'stroke';
  stopById?: {
    [id: string]: Btwx.GradientStop;
  };
  cssGradient?: string;
  enableLayersFill?(payload: EnableLayersFillPayload): LayerTypes;
  enableLayersStroke?(payload: EnableLayersStrokePayload): LayerTypes;
  setLayersGradient?(payload: SetLayersGradientPayload): LayerTypes;
  openGradientEditor?(payload: OpenGradientEditorPayload): GradientEditorTypes;
}

const GradientInput = (props: GradientInputProps): ReactElement => {
  const { prop, enabledValue, displayGradient, gradientTypeValue, stopById, selected, gradientValue, gradientOpacity, gradientEditorOpen, enableLayersFill, enableLayersStroke, setLayersGradient, cssGradient, openGradientEditor, gradientEditorProp } = props;
  const [enabled, setEnabled] = useState<boolean | 'multi'>(enabledValue);
  const [gradient, setGradient] = useState(gradientValue);
  const [opacity, setOpacity] = useState<number | string>(gradientOpacity !== 'multi' ? Math.round(gradientOpacity * 100) : gradientOpacity);

  useEffect(() => {
    setEnabled(enabledValue);
    setGradient(gradientValue);
    setOpacity(gradientOpacity !== 'multi' ? Math.round(gradientOpacity * 100) : gradientOpacity);
  }, [gradientValue, selected, gradientOpacity, stopById, enabledValue]);

  const handleOpacityChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  const handleOpacitySubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    try {
      let nextOpacity = mexp.eval(`${opacity}`) as any;
      if (nextOpacity > 100) {
        nextOpacity = 100;
      }
      if (nextOpacity < 0) {
        nextOpacity = 0;
      }
      if (nextOpacity !== gradientOpacity) {
        const newGradient = {
          ...gradient,
          stops: gradient.stops.reduce((result, current) => {
            result = [...result, {
              ...current,
              color: {
                ...current.color,
                a: Math.round(nextOpacity) / 100
              }
            }];
            return result;
          }, [])
        }
        setLayersGradient({layers: selected, prop: prop, gradient: newGradient});
      } else {
        setOpacity(gradientOpacity !== 'multi' ? Math.round(gradientOpacity * 100) : gradientOpacity);
      }
    } catch(error) {
      setOpacity(gradientOpacity !== 'multi' ? Math.round(gradientOpacity * 100) : gradientOpacity);
    }
  }

  const handleSwatchClick = (bounding: DOMRect): void => {
    if (!enabled) {
      switch(prop) {
        case 'fill':
          enableLayersFill({layers: selected});
          break;
        case 'stroke':
          enableLayersStroke({layers: selected});
          break;
      }
    }
    if (!gradientEditorOpen) {
      openGradientEditor({
        prop: prop,
        x: bounding.x,
        y: bounding.y - (bounding.height - 10) // 2 (swatch drop shadow) + 8 (top-padding)
      });
    }
  };

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarSwatch
          isActive={gradientEditorOpen && prop === gradientEditorProp}
          style={{
            background: displayGradient !== 'multi' ? cssGradient : 'none'
          }}
          onClick={handleSwatchClick}
          bottomLabel='Gradient'
          multi={displayGradient === 'multi'} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <GradientTypeSelector
          gradientTypeValue={gradientTypeValue}
          disabled={!enabled || enabled === 'multi'}
          prop={prop} />
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

const mapStateToProps = (state: RootState, ownProps: GradientInputProps) => {
  const { layer, gradientEditor } = state;
  const selected = layer.present.selected;
  const gradientValue = layer.present.byId[selected[0]].style[ownProps.prop].gradient;
  const enabledValue = (() => {
    switch(ownProps.prop) {
      case 'fill':
        return getSelectedFillEnabled(state);
      case 'stroke':
        return getSelectedStrokeEnabled(state);
    }
  })() as boolean | 'multi';
  const gradientTypeValue = (() => {
    switch(ownProps.prop) {
      case 'fill':
        return getSelectedFillGradientType(state);
      case 'stroke':
        return getSelectedStrokeGradientType(state);
    }
  })() as Btwx.GradientType | 'multi';
  const displayGradient = (() => {
    switch(ownProps.prop) {
      case 'fill':
        return getSelectedFillGradient(state);
      case 'stroke':
        return getSelectedStrokeGradient(state);
    }
  })() as Btwx.Gradient | 'multi';
  const stops = gradientValue.stops;
  const gradientOpacity = stops.every((stop) => stop.color.a === stops[0].color.a) ? stops[0].color.a : 'multi';
  const gradientEditorOpen = gradientEditor.isOpen;
  const gradientEditorProp = gradientEditor.prop;
  const sortedStops = [...stops].sort((a,b) => { return a.position - b.position });
  const cssGradient = sortedStops.reduce((result, current, index) => {
    const stopColor = tinyColor({h: current.color.h, s: current.color.s, l: current.color.l, a: current.color.a}).toHslString();
    result = result + `${stopColor} ${current.position * 100}%`;
    if (index !== stops.length - 1) {
      result = result + ',';
    } else {
      result = result + ')';
    }
    return result;
  }, `linear-gradient(to right,`);
  return { enabledValue, selected, gradientValue, gradientTypeValue, gradientOpacity, gradientEditorOpen, cssGradient, displayGradient, gradientEditorProp };
};

export default connect(
  mapStateToProps,
  {
    enableLayersFill,
    enableLayersStroke,
    setLayersGradient,
    openGradientEditor
  }
)(GradientInput);