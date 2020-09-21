import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateSelectionFrame } from '../store/utils/layer';
import { LayerState } from '../store/reducers/layer';
import { getLayerAndDescendants } from '../store/selectors/layer';
import { paperMain } from '../canvas';

interface SelectionFrameProps {
  selected: string[];
  selectedWithChildren?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
}

const SelectionFrame = (props: SelectionFrameProps): ReactElement => {
  const { selected, selectedWithChildren } = props;

  useEffect(() => {
    updateSelectionFrame({selected: selected, byId: selectedWithChildren.byId} as LayerState, 'all', true);
    return () => {
      const selectionFrame = paperMain.project.getItem({ data: { id: 'SelectionFrame' } });
      if (selectionFrame) {
        selectionFrame.remove();
      }
    }
  }, [selectedWithChildren, selected]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  selectedWithChildren: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const selectedWithChildren = layer.present.selected.reduce((result: { allIds: string[]; byId: { [id: string]: em.Layer } }, current) => {
    const layerAndChildren = getLayerAndDescendants(layer.present, current);
    result.allIds = [...result.allIds, ...layerAndChildren];
    layerAndChildren.forEach((id) => {
      result.byId[id] = layer.present.byId[id];
    });
    return result;
  }, { allIds: [], byId: {} });
  return { selected, selectedWithChildren };
};

export default connect(
  mapStateToProps
)(SelectionFrame);