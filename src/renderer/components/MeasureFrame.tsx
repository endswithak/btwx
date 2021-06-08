import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateMeasureGuides } from '../store/actions/layer';
import { getSelectedBounds, getLayerBounds } from '../store/selectors/layer';
import { paperMain } from '../canvas';

const MeasureFrame = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const selectedBounds = useSelector((state: RootState) => getSelectedBounds(state));
  const hoverBounds = useSelector((state: RootState) => state.layer.present.hover ? getLayerBounds(state.layer.present, state.layer.present.hover) : null);

  useEffect(() => {
    updateMeasureGuides(selectedBounds, { all: hoverBounds });
    return () => {
      const measureFrame = paperMain.project.getItem({ data: { id: 'measureGuides' } });
      measureFrame.removeChildren();
    }
  }, [hoverBounds, selectedBounds]);

  return null;
}

export default MeasureFrame;