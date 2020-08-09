import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSelect from './SidebarSelect';
import { RootState } from '../store/reducers';
import { SetLayersBlendModePayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersBlendMode } from '../store/actions/layer';

interface BlendModeSelectorProps {
  selected?: string[];
  blendModeValue?: string;
  setLayersBlendMode?(payload: SetLayersBlendModePayload): LayerTypes;
}

const BlendModeSelector = (props: BlendModeSelectorProps): ReactElement => {
  const { selected, blendModeValue, setLayersBlendMode } = props;

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
    { value: 'luminosity', label: 'Luminosity' },
    { value: 'add', label: 'Add' },
    { value: 'subtract', label: 'Subtract' },
    { value: 'average', label: 'Average' },
    { value: 'pin-light', label: 'Pin Light' },
    { value: 'negation', label: 'Negation' },
    { value: 'source-over', label: 'Source Over' },
    { value: 'source-in', label: 'Source In' },
    { value: 'source-out', label: 'Source Out' },
    { value: 'source-atop', label: 'Source Atop' },
    { value: 'destination-over', label: 'Destination Over' },
    { value: 'destination-in', label: 'Destination In' },
    { value: 'destination-out', label: 'Destination Out' },
    { value: 'destination-atop', label: 'Destination Atop' },
    { value: 'lighter', label: 'Lighter' },
    { value: 'darker', label: 'Darker' },
    { value: 'copy', label: 'Copy' },
    { value: 'xor', label: 'Xor' }
  ];

  const [blendMode, setBlendMode] = useState(blendModeValue !== 'multi' ? options.find((option) => option.value === blendModeValue) : null);

  useEffect(() => {
    if (blendModeValue === 'multi') {
      setBlendMode(null);
    } else {
      setBlendMode(options.find((option) => option.value === blendModeValue));
    }
  }, [blendModeValue, selected]);

  const handleChange = (selectedOption: { value: em.BlendMode; label: string }): void => {
    setBlendMode(selectedOption);
    setLayersBlendMode({layers: selected, blendMode: selectedOption.value});
  }

  return (
    <SidebarSelect
      value={blendMode}
      onChange={handleChange}
      options={options}
      placeholder='multi'
      bottomLabel='Blend Mode'
    />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  blendModeValue: string;
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const blendModeValue = (() => {
    switch(layer.present.selected.length) {
      case 1:
        return layer.present.byId[selected[0]].style.blendMode;
      default: {
        if (selected.every((id: string) => layer.present.byId[id].style.blendMode === layer.present.byId[layer.present.selected[0]].style.blendMode)) {
          return layer.present.byId[selected[0]].style.blendMode;
        } else {
          return 'multi';
        }
      }
    }
  })();
  return { selected, blendModeValue };
};

export default connect(
  mapStateToProps,
  { setLayersBlendMode }
)(BlendModeSelector);