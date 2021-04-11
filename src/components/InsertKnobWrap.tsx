import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import InsertKnob from './InsertKnob';

interface InsertKnobWrapProps {
  isActive?: boolean;
}

const InsertKnobWrap = (props: InsertKnobWrapProps): ReactElement => {
  const { isActive } = props;

  return (
    isActive
    ? <InsertKnob />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isActive: boolean;
} => {
  const { insertKnob, canvasSettings } = state;
  const isActive = !canvasSettings.zooming && insertKnob.isActive;
  return { isActive };
};

export default connect(
  mapStateToProps
)(InsertKnobWrap);