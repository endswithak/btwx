import paper from 'paper';
import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import FillColorInput from './FillColorInput';
import FillGradientInput from './FillGradientInput';

interface FillInputProps {
  fillType?: em.FillType;
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
  const selected = layer.present.selected;
  const fillType = layer.present.byId[layer.present.selected[0]].style.fill.fillType;
  return { selected, fillType };
};

export default connect(
  mapStateToProps
)(FillInput);