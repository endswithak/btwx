import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import FillGradientInput from './FillGradientInput';
import FillColorInput from './FillColorInput';

interface FillInputProps {
  fillType: em.FillType;
}

const FillInput = (props: FillInputProps): ReactElement => {
  const { fillType } = props;
  switch(fillType) {
    case 'color':
      return <FillColorInput />
    case 'gradient':
      return <FillGradientInput />
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