import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ExcludeLayersPayload } from '../store/actionTypes/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

interface ExcludeButtonProps {
  selected: string[];
  canExclude: boolean;
  applyBooleanOperationThunk(payload: ExcludeLayersPayload, booleanOperation: em.BooleanOperation): void;
}

const ExcludeButton = (props: ExcludeButtonProps): ReactElement => {
  const { selected, canExclude, applyBooleanOperationThunk } = props;

  const handleExcludeClick = (): void => {
    if (canExclude) {
      applyBooleanOperationThunk({layers: selected}, 'exclude');
    }
  }

  return (
    <TopbarButton
      label='Difference'
      onClick={handleExcludeClick}
      icon='exclude'
      disabled={!canExclude} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canExclude: boolean;
} => {
  const { layer, selection } = state;
  const selected = layer.present.selected;
  const canExclude = selection.canBoolean;
  return { selected, canExclude };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(ExcludeButton);