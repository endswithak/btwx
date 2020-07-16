import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSelect from './SidebarSelect';
import { RootState } from '../store/reducers';
import { SetLayerFillGradientTypePayload, SetLayerStrokeGradientTypePayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerFillGradientType, setLayerStrokeGradientType } from '../store/actions/layer';

interface GradientTypeSelectorProps {
  selected?: string[];
  gradientTypeValue: string;
  disabled?: boolean;
  prop: 'fill' | 'stroke';
  setLayerFillGradientType?(payload: SetLayerFillGradientTypePayload): LayerTypes;
  setLayerStrokeGradientType?(payload: SetLayerStrokeGradientTypePayload): LayerTypes;
}

const GradientTypeSelector = (props: GradientTypeSelectorProps): ReactElement => {
  const { selected, prop, disabled, gradientTypeValue, setLayerFillGradientType, setLayerStrokeGradientType } = props;

  const options: { value: em.GradientType; label: string }[] = [
    { value: 'linear', label: 'Linear' },
    { value: 'radial', label: 'Radial' }
  ];

  const [gradientType, setGradientType] = useState(options.find((option) => option.value === gradientTypeValue));

  useEffect(() => {
    setGradientType(options.find((option) => option.value === gradientTypeValue));
  }, [gradientTypeValue, selected]);

  const handleChange = (selectedOption: { value: em.GradientType; label: string }) => {
    setGradientType(selectedOption);
    switch(prop) {
      case 'fill':
        setLayerFillGradientType({id: selected[0], gradientType: selectedOption.value});
        break;
      case 'stroke':
        setLayerStrokeGradientType({id: selected[0], gradientType: selectedOption.value});
        break;
    }
  }

  return (
    <SidebarSelect
      value={gradientType}
      onChange={handleChange}
      options={options}
      placeholder={'Gradient Type'}
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
  { setLayerFillGradientType, setLayerStrokeGradientType }
)(GradientTypeSelector);