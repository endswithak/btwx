import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SidebarSelect from './SidebarSelect';
import { RootState } from '../store/reducers';
import { setLayersGradientType } from '../store/actions/layer';

interface GradientTypeSelectorProps {
  prop: 'fill' | 'stroke';
  gradientTypeValue: Btwx.GradientType | 'multi';
  disabled?: boolean;
}

const GradientTypeSelector = (props: GradientTypeSelectorProps): ReactElement => {
  const { prop, disabled, gradientTypeValue } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const dispatch = useDispatch();

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

  const handleChange = (selectedOption: { value: Btwx.GradientType; label: string }): void => {
    setGradientType(selectedOption);
    dispatch(setLayersGradientType({layers: selected, prop: prop, gradientType: selectedOption.value}));
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

export default GradientTypeSelector;