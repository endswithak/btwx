import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import ShapeTool from './ShapeTool';

interface ShapeToolWrapProps {
  isEnabled?: boolean;
}

const ShapeToolWrap = (props: ShapeToolWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <ShapeTool />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { shapeTool } = state;
  const isEnabled = shapeTool.isEnabled;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(ShapeToolWrap);