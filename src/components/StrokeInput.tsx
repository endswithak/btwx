import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import StrokeGradientInput from './StrokeGradientInput';
import StrokeColorInput from './StrokeColorInput';

interface StrokeInputProps {
  fillType: em.FillType;
}

const StrokeInput = (props: StrokeInputProps): ReactElement => {
  const { fillType } = props;
  switch(fillType) {
    case 'color':
      return <StrokeColorInput />
    case 'gradient':
      return <StrokeGradientInput />
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