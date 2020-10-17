import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { UniteLayersPayload } from '../store/actionTypes/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

interface UniteButtonProps {
  selected: string[];
  canUnite: boolean;
  applyBooleanOperationThunk(payload: UniteLayersPayload, booleanOperation: em.BooleanOperation): void;
}

const UniteButton = (props: UniteButtonProps): ReactElement => {
  const { selected, canUnite, applyBooleanOperationThunk } = props;

  const handleUniteClick = (): void => {
    if (canUnite) {
      applyBooleanOperationThunk({layers: selected}, 'unite');
    }
  }

  return (
    <TopbarButton
      label='Union'
      onClick={handleUniteClick}
      icon='unite'
      disabled={!canUnite} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canUnite: boolean;
} => {
  const { layer, selection } = state;
  const selected = layer.present.selected;
  const canUnite = selection.canBoolean;
  return { selected, canUnite };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(UniteButton);