import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSelect from './SidebarSelect';
import { RootState } from '../store/reducers';
import { SetLayersFillGradientTypePayload, SetLayersStrokeGradientTypePayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersFillGradientType, setLayersStrokeGradientType } from '../store/actions/layer';

interface GradientTypeSelectorProps {
  selected?: string[];
  gradientTypeValue: em.GradientType | 'multi';
  disabled?: boolean;
  prop: 'fill' | 'stroke';
  setLayersFillGradientType?(payload: SetLayersFillGradientTypePayload): LayerTypes;
  setLayersStrokeGradientType?(payload: SetLayersStrokeGradientTypePayload): LayerTypes;
}

const GradientTypeSelector = (props: GradientTypeSelectorProps): ReactElement => {
  const { selected, prop, disabled, gradientTypeValue, setLayersFillGradientType, setLayersStrokeGradientType } = props;

  const options: { value: em.GradientType; label: string }[] = [
    { value: 'linear', label: 'Linear' },
    { value: 'radial', label: 'Radial' }
  ];

  const [gradientType, setGradientType] = useState(options.find((option) => option.value === gradientTypeValue));

  useEffect(() => {
    if (gradientTypeValue === 'multi') {
      setGradientType(null);
    } else {
      setGradientType(options.find((option) => option.value === gradientTypeValue));
    }
  }, [gradientTypeValue, selected]);

  const handleChange = (selectedOption: { value: em.GradientType; label: string }) => {
    setGradientType(selectedOption);
    switch(prop) {
      case 'fill':
        setLayersFillGradientType({layers: selected, gradientType: selectedOption.value});
        break;
      case 'stroke':
        setLayersStrokeGradientType({layers: selected, gradientType: selectedOption.value});
        break;
    }
  }

  return (
    <SidebarSelect
      value={gradientType}
      onChange={handleChange}
      options={options}
      placeholder='multi'
      bottomLabel='Type'
      disabled={disabled}
    />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  //const gradientTypeValue = (layer.present.byId[selected[0]] as em.Text).style.fill.gradient.gradientType;
  return { selected };
};

export default connect(
  mapStateToProps,
  { setLayersFillGradientType, setLayersStrokeGradientType }
)(GradientTypeSelector);