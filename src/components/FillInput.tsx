import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import GradientInput from './GradientInput';
import ColorInput from './ColorInput';

interface FillInputProps {
  fillType: em.FillType;
}

const FillInput = (props: FillInputProps): ReactElement => {
  const { fillType } = props;
  switch(fillType) {
    case 'color':
      return <ColorInput prop='fill' />
    case 'gradient':
      return <GradientInput prop='fill' />
  }
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const fillType = layer.present.byId[layer.present.selected[0]].style.fill.fillType;
  return { fillType };
};

export default connect(
  mapStateToProps
)(FillInput);