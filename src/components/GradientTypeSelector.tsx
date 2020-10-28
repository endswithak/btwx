import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSelect from './SidebarSelect';
import { RootState } from '../store/reducers';
import { SetLayersGradientTypePayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersGradientType } from '../store/actions/layer';

interface GradientTypeSelectorProps {
  selected?: string[];
  gradientTypeValue: Btwx.GradientType | 'multi';
  disabled?: boolean;
  prop: 'fill' | 'stroke';
  setLayersGradientType?(payload: SetLayersGradientTypePayload): LayerTypes;
}

const GradientTypeSelector = (props: GradientTypeSelectorProps): ReactElement => {
  const { selected, prop, disabled, gradientTypeValue, setLayersGradientType } = props;

  const options: { value: Btwx.GradientType; label: string }[] = [
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

  const handleChange = (selectedOption: { value: Btwx.GradientType; label: string }) => {
    setGradientType(selectedOption);
    setLayersGradientType({layers: selected, prop: prop, gradientType: selectedOption.value});
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

const mapStateToProps = (state: RootState, ownProps: GradientTypeSelectorProps) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: Btwx.Layer[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const styleValues: (em.Fill | Btwx.Stroke)[] = layerItems.reduce((result, current) => {
    switch(ownProps.prop) {
      case 'fill':
        return [...result, current.style.fill];
      case 'stroke':
        return [...result, current.style.stroke];
    }
  }, []);
  const gradientTypeValue = styleValues.every((style) => style.gradient.gradientType === styleValues[0].gradient.gradientType) ? styleValues[0].gradient.gradientType : 'multi' ;
  return { selected, gradientTypeValue };
};

export default connect(
  mapStateToProps,
  { setLayersGradientType }
)(GradientTypeSelector);