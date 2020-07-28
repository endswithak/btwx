import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSelect from './SidebarSelect';
import { RootState } from '../store/reducers';
import { SetLayerBlendModePayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerBlendMode } from '../store/actions/layer';

interface BlendModeSelectorProps {
  selected?: string[];
  blendModeValue?: string;
  setLayerBlendMode?(payload: SetLayerBlendModePayload): LayerTypes;
  disabled?: boolean;
}

const BlendModeSelector = (props: BlendModeSelectorProps): ReactElement => {
  const { selected, blendModeValue, setLayerBlendMode, disabled } = props;

  const options: { value: em.BlendMode; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'darken', label: 'Darken' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'color-burn', label: 'Color Burn' },
    { value: 'lighten', label: 'Lighten' },
    { value: 'screen', label: 'Screen' },
    { value: 'color-dodge', label: 'Color Dodge' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'soft-light', label: 'Soft Light' },
    { value: 'hard-light', label: 'Hard Light' },
    { value: 'difference', label: 'Difference' },
    { value: 'exclusion', label: 'Exclusion' },
    { value: 'hue', label: 'Hue' },
    { value: 'saturation', label: 'Saturation' },
    { value: 'color', label: 'Color' },
    { value: 'luminosity', label: 'Luminosity' }
  ];

  const [blendMode, setBlendMode] = useState(options.find((option) => option.value === blendModeValue));

  useEffect(() => {
    setBlendMode(options.find((option) => option.value === blendModeValue));
  }, [blendModeValue, selected]);

  const handleChange = (selectedOption: { value: em.BlendMode; label: string }): void => {
    setBlendMode(selectedOption);
    setLayerBlendMode({id: selected[0], blendMode: selectedOption.value});
  }

  return (
    <SidebarSelect
      value={blendMode}
      onChange={handleChange}
      options={options}
      placeholder='Blend Mode'
      bottomLabel='Blend Mode'
      disabled={disabled}
    />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  blendModeValue: string;
  disabled: boolean;
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const blendModeValue = (layer.present.byId[selected[0]] as em.Text).style.blendMode;
  const disabled = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return true;
      case 1:
        return false;
      default:
        return true;
    }
  })();
  return { selected, blendModeValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayerBlendMode }
)(BlendModeSelector);