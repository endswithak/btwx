import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { enableLayersFill, enableLayersStroke, setLayersGradient } from '../store/actions/layer';
import { openGradientEditor } from '../store/actions/gradientEditor';
import { getSelectedFillEnabled, getSelectedStrokeEnabled, getSelectedFillGradientType, getSelectedStrokeGradientType, getSelectedFillGradient, getSelectedStrokeGradient } from '../store/selectors/layer';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import GradientTypeSelector from './GradientTypeSelector';

interface GradientInputProps {
  prop: 'fill' | 'stroke';
}

const GradientInput = (props: GradientInputProps): ReactElement => {
  const { prop } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const gradientValue = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.selected[0]].style[prop].gradient);
  const enabledValue = (() => {
    switch(prop) {
      case 'fill':
        return useSelector((state: RootState) => getSelectedFillEnabled(state));
      case 'stroke':
        return useSelector((state: RootState) => getSelectedStrokeEnabled(state));
    }
  })() as boolean | 'multi';
  const gradientTypeValue = (() => {
    switch(prop) {
      case 'fill':
        return useSelector((state: RootState) => getSelectedFillGradientType(state));
      case 'stroke':
        return useSelector((state: RootState) => getSelectedStrokeGradientType(state));
    }
  })() as Btwx.GradientType | 'multi';
  const displayGradient = (() => {
    switch(prop) {
      case 'fill':
        return useSelector((state: RootState) => getSelectedFillGradient(state));
      case 'stroke':
        return useSelector((state: RootState) => getSelectedStrokeGradient(state));
    }
  })() as Btwx.Gradient | 'multi';
  const stops = gradientValue && gradientValue.stops;
  const gradientOpacity = stops && stops.every((stop) => stop.color.a === stops[0].color.a) ? stops[0].color.a : 'multi';
  const gradientEditorOpen = useSelector((state: RootState) => state.gradientEditor.isOpen);
  const gradientEditorProp = useSelector((state: RootState) => state.gradientEditor.prop);
  const sortedStops = stops && [...stops].sort((a,b) => { return a.position - b.position });
  const cssGradient = sortedStops && sortedStops.reduce((result, current, index) => {
    const stopColor = tinyColor({h: current.color.h, s: current.color.s, l: current.color.l, a: current.color.a}).toHslString();
    result = result + `${stopColor} ${current.position * 100}%`;
    if (index !== stops.length - 1) {
      result = result + ',';
    } else {
      result = result + ')';
    }
    return result;
  }, `linear-gradient(to right,`);
  const [enabled, setEnabled] = useState<boolean | 'multi'>(enabledValue);
  const [gradient, setGradient] = useState(gradientValue);
  const [opacity, setOpacity] = useState<number | string>(gradientOpacity !== 'multi' ? Math.round(gradientOpacity * 100) : gradientOpacity);
  const dispatch = useDispatch();

  useEffect(() => {
    setEnabled(enabledValue);
    setGradient(gradientValue);
    setOpacity(gradientOpacity !== 'multi' ? Math.round(gradientOpacity * 100) : gradientOpacity);
  }, [gradientValue, selected, gradientOpacity, enabledValue]);

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
        dispatch(setLayersGradient({layers: selected, prop: prop, gradient: newGradient}));
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
          dispatch(enableLayersFill({layers: selected}));
          break;
        case 'stroke':
          dispatch(enableLayersStroke({layers: selected}));
          break;
      }
    }
    if (!gradientEditorOpen) {
      dispatch(openGradientEditor({
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

export default GradientInput;