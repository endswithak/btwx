import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { enableLayersFill, enableLayersStroke, setLayersGradient } from '../store/actions/layer';
import { openGradientEditor } from '../store/actions/gradientEditor';
import { getSelectedFillEnabled, getSelectedStrokeEnabled, getSelectedFillGradientType, getSelectedStrokeGradientType, getSelectedFillGradient, getSelectedStrokeGradient } from '../store/selectors/layer';
import PercentageFormGroup from './PercentageFormGroup';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import GradientTypeSelector from './GradientTypeSelector';

interface GradientInputProps {
  prop: 'fill' | 'stroke';
}

const GradientInput = (props: GradientInputProps): ReactElement => {
  const opacityFormControlRef = useRef(null);
  const { prop } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const gradientValue = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.selected[0]].style[prop].gradient);
  const enabledValue: boolean | 'multi' = useSelector((state: RootState) => {
    switch(prop) {
      case 'fill':
        return getSelectedFillEnabled(state);
      case 'stroke':
        return getSelectedStrokeEnabled(state);
    }
  });
  const gradientTypeValue: Btwx.GradientType | 'multi' = useSelector((state: RootState) => {
    switch(prop) {
      case 'fill':
        return getSelectedFillGradientType(state);
      case 'stroke':
        return getSelectedStrokeGradientType(state);
    }
  });
  const displayGradient: Btwx.Gradient | 'multi' = useSelector((state: RootState) => {
    switch(prop) {
      case 'fill':
        return getSelectedFillGradient(state);
      case 'stroke':
        return getSelectedStrokeGradient(state);
    }
  });
  const stops = gradientValue && gradientValue.stops;
  const gradientOpacity = stops && stops.every((stop) => stop.color.a === stops[0].color.a) ? stops[0].color.a : 'multi';
  const gradientEditorOpen = useSelector((state: RootState) => state.gradientEditor.isOpen);
  const gradientEditorProp = useSelector((state: RootState) => state.gradientEditor.prop);
  const sortedStops = stops && [...stops].sort((a,b) => { return a.position - b.position });
  const cssGradient = sortedStops && sortedStops.reduce((result, current, index) => {
    const stopColor = tinyColor({h: current.color.h, s: current.color.s, l: current.color.l, a: current.color.a}).toRgbString();
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
  const dispatch = useDispatch();

  useEffect(() => {
    setEnabled(enabledValue);
    setGradient(gradientValue);
  }, [gradientValue, selected, gradientOpacity, enabledValue]);

  const handleSubmitSuccess = (nextOpacity: any): void => {
    dispatch(setLayersGradient({layers: selected, prop: prop, gradient: {
      ...gradient,
      stops: gradient.stops.reduce((result, current) => {
        result = [...result, {
          ...current,
          color: {
            ...current.color,
            a: nextOpacity
          }
        }];
        return result;
      }, [])
    }}));
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
        <PercentageFormGroup
          controlId={`control-${prop}-gradient-opacity`}
          value={gradientOpacity}
          ref={opacityFormControlRef}
          disabled={!enabled || enabled === 'multi'}
          submitOnBlur
          canvasAutoFocus
          size='small'
          onSubmitSuccess={handleSubmitSuccess}
          label='Opacity' />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default GradientInput;