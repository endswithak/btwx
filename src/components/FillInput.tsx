import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import GradientInput from './GradientInput';
import ColorInput from './ColorInput';
import MultiInput from './MultiInput';

interface FillInputProps {
  fillType: em.FillType & 'multi';
}

const FillInput = (props: FillInputProps): ReactElement => {
  const { fillType } = props;
  switch(fillType) {
    case 'color':
      return <ColorInput prop='fill' />
    case 'gradient':
      return <GradientInput prop='fill' />
    case 'multi':
      return <MultiInput prop='fill' />
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
    return [...result, current.style.fill.fillType];
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
)(FillInput);