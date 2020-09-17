import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLayerAndDescendants } from '../store/selectors/layer';
import { updateMeasureFrame } from '../store/utils/layer';
import { LayerState } from '../store/reducers/layer';
import { paperMain } from '../canvas';

interface MeasureFrameProps {
  selected?: string[];
  zoom: number;
  hover: string;
}

const MeasureFrame = (props: MeasureFrameProps): ReactElement => {
  const { selected, zoom, hover } = props;

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      const measureFrame = paperMain.project.getItem({ data: { id: 'measureFrame' } });
      if (measureFrame) {
        measureFrame.remove();
      }
    }
  }

  useEffect(() => {
    updateMeasureFrame({selected: selected, hover: hover} as LayerState, { all: hover });
    document.getElementById('canvas').addEventListener('wheel', handleWheel);
    return () => {
      const measureFrame = paperMain.project.getItem({ data: { id: 'measureFrame' } });
      document.getElementById('canvas').removeEventListener('wheel', handleWheel);
      if (measureFrame) {
        measureFrame.remove();
      }
    }
  }, [selected, zoom, hover]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, documentSettings } = state;
  const selected = layer.present.selected;
  const hover = layer.present.hover;
  const zoom = documentSettings.matrix[0];
  return { selected, zoom, hover };
};

export default connect(
  mapStateToProps
)(MeasureFrame);