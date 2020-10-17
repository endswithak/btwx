import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateSelectionPropsThunk } from '../store/actions/selection';

interface SelectionProps {
  selected?: string[];
  selectedById?: {
    [id: string]: em.Layer;
  };
  updateSelectionPropsThunk?(): void;
}

const Selection = (props: SelectionProps): ReactElement => {
  const { selected, selectedById, updateSelectionPropsThunk } = props;

  useEffect(() => {
    updateSelectionPropsThunk();
  }, [selected, selectedById]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  selectedById: {
    [id: string]: em.Layer;
  };
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const selectedById = layer.present.selected.reduce((result, current) => {
    result = {
      ...result,
      [current]: layer.present.byId[current]
    }
    return result;
  }, {});
  return { selected, selectedById };
};

export default connect(
  mapStateToProps,
  { updateSelectionPropsThunk }
)(Selection);