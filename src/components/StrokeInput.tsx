import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
// import StrokeGradientInput from './StrokeGradientInput';
// import StrokeColorInput from './StrokeColorInput';
import GradientInput from './GradientInput';
import ColorInput from './ColorInput';

interface StrokeInputProps {
  fillType: em.FillType;
}

const StrokeInput = (props: StrokeInputProps): ReactElement => {
  const { fillType } = props;
  switch(fillType) {
    case 'color':
      return <ColorInput prop='stroke' />
    case 'gradient':
      return <GradientInput prop='stroke' />
  }
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const fillType = layer.present.byId[layer.present.selected[0]].style.stroke.fillType;
  return { fillType };
};

export default connect(
  mapStateToProps
)(StrokeInput);