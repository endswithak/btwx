import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSelect from './SidebarSelect';
import { RootState } from '../store/reducers';
import { SetLayerFillGradientTypePayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerFillGradientType } from '../store/actions/layer';

interface GradientTypeSelectorProps {
  selected?: string[];
  gradientTypeValue: string;
  setLayerFillGradientType?(payload: SetLayerFillGradientTypePayload): LayerTypes;
}

const GradientTypeSelector = (props: GradientTypeSelectorProps): ReactElement => {
  const { selected, gradientTypeValue, setLayerFillGradientType } = props;

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
    setLayerFillGradientType({id: selected[0], gradientType: selectedOption.value});
  }

  return (
    <SidebarSelect
      value={gradientType}
      onChange={handleChange}
      options={options}
      placeholder={'Gradient Type'}
      bottomLabel='Type'
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
  { setLayerFillGradientType }
)(GradientTypeSelector);