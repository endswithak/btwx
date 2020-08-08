import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import GradientInput from './GradientInput';
import ColorInput from './ColorInput';
import MultiInput from './MultiInput';

interface StrokeInputProps {
  fillType: em.FillType | 'multi';
}

const StrokeInput = (props: StrokeInputProps): ReactElement => {
  const { fillType } = props;
  switch(fillType) {
    case 'color':
      return <ColorInput prop='stroke' />
    case 'gradient':
      return <GradientInput prop='stroke' />
    case 'multi':
      return <MultiInput prop='stroke' />
  }
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: em.Layer[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const fillTypes: number[] = layerItems.reduce((result, current) => {
    return [...result, current.style.stroke.fillType];
  }, []);
  const fillType = (() => {
    if (fillTypes.every((value: number) => value === fillTypes[0])) {
      return fillTypes[0];
    } else {
      return 'multi';
    }
  })();
  return { fillType };
};

export default connect(
  mapStateToProps
)(StrokeInput);