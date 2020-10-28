import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedById } from '../store/selectors';
import { updateSelectionThunk } from '../store/actions/selection';

interface SelectionProps {
  selected?: string[];
  selectedById?: {
    [id: string]: Btwx.Layer;
  };
  updateSelectionThunk?(): void;
}

const Selection = (props: SelectionProps): ReactElement => {
  const { selected, selectedById, updateSelectionThunk } = props;

  useEffect(() => {
    updateSelectionThunk();
  }, [selected, selectedById]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  selectedById: {
    [id: string]: Btwx.Layer;
  };
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  return {
    selected,
    selectedById: getSelectedById(state)
  };
};

export default connect(
  mapStateToProps,
  { updateSelectionThunk }
)(Selection);