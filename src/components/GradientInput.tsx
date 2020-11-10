import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { EnableLayersFillPayload, EnableLayersStrokePayload, SetLayersGradientPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayersFill, enableLayersStroke, setLayersGradient } from '../store/actions/layer';
import { OpenGradientEditorPayload, GradientEditorTypes } from '../store/actionTypes/gradientEditor';
import { openGradientEditor } from '../store/actions/gradientEditor';
import { gradientsMatch } from '../store/selectors/layer';
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
  isGradientEditorOpen?: boolean;
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
  const { prop, enabledValue, displayGradient, gradientTypeValue, stopById, selected, gradientValue, gradientOpacity, isGradientEditorOpen, enableLayersFill, enableLayersStroke, setLayersGradient, cssGradient, openGradientEditor } = props;
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
    if (!isGradientEditorOpen) {
      openGradientEditor({
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
          isActive={isGradientEditorOpen}
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
  const layerItems: Btwx.Layer[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const styleValues: (Btwx.Fill | Btwx.Stroke)[] = layerItems.reduce((result, current) => {
    switch(ownProps.prop) {
      case 'fill':
        return [...result, current.style.fill];
      case 'stroke':
        return [...result, current.style.stroke];
    }
  }, []);
  const enabledValue = ((): boolean | 'multi' => {
    if (styleValues.every((value: Btwx.Fill | Btwx.Stroke) => value.enabled === styleValues[0].enabled)) {
      return styleValues[0].enabled;
    } else {
      return 'multi';
    }
  })();
  const gradientTypeValue = ((): Btwx.GradientType | 'multi' => {
    if (styleValues.every((value: Btwx.Fill | Btwx.Stroke) => value.gradient.gradientType === styleValues[0].gradient.gradientType)) {
      return styleValues[0].gradient.gradientType;
    } else {
      return 'multi';
    }
  })();
  const displayGradient = ((): Btwx.Gradient | 'multi' => {
    if (styleValues.every((value: Btwx.Fill | Btwx.Stroke) => gradientsMatch(value.gradient, styleValues[0].gradient))) {
      return styleValues[0].gradient;
    } else {
      return 'multi';
    }
  })();
  const gradientValue = styleValues[0].gradient;
  const stops = gradientValue.stops;
  const gradientOpacity = stops.every((stop) => stop.color.a === stops[0].color.a) ? stops[0].color.a : 'multi';
  const isGradientEditorOpen = gradientEditor.isOpen;
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
  return { enabledValue, selected, gradientValue, gradientTypeValue, gradientOpacity, isGradientEditorOpen, cssGradient, displayGradient };
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