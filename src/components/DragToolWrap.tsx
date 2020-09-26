import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import DragTool from './DragTool';

interface DragToolWrapProps {
  isEnabled?: boolean;
}

const DragToolWrap = (props: DragToolWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <DragTool />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { dragTool } = state;
  const isEnabled = dragTool.isEnabled;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(DragToolWrap);