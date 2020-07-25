import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateSelectionFrame } from '../store/utils/layer';
import { LayerState } from '../store/reducers/layer';
import { paperMain } from '../canvas';

interface SelectionFrameProps {
  selected?: string[];
  selectedById?: {
    [id: string]: em.Layer;
  };
  zoom: number;
}

const SelectionFrame = (props: SelectionFrameProps): ReactElement => {
  const { selected, selectedById, zoom } = props;

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      const selectionFrame = paperMain.project.getItem({ data: { id: 'selectionFrame' } });
      if (selectionFrame) {
        selectionFrame.remove();
      }
    }
  }

  useEffect(() => {
    updateSelectionFrame({selected: selected, byId: selectedById} as LayerState, 'all', true);
    document.getElementById('canvas').addEventListener('wheel', handleWheel);
    return () => {
      const selectionFrame = paperMain.project.getItem({ data: { id: 'selectionFrame' } });
      document.getElementById('canvas').removeEventListener('wheel', handleWheel);
      if (selectionFrame) {
        selectionFrame.remove();
      }
    }
  }, [selectedById, selected, zoom]);

  return (
    <div />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, canvasSettings } = state;
  const selected = layer.present.selected;
  const selectedById = layer.present.selected.reduce((result: { [id: string]: em.Layer }, current) => {
    result[current] = layer.present.byId[current];
    return result;
  }, {});
  const zoom = canvasSettings.matrix[0];
  return { selected, selectedById, zoom };
};

export default connect(
  mapStateToProps
)(SelectionFrame);