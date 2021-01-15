import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateMeasureGuides } from '../store/actions/layer';
import { paperMain } from '../canvas';

const MeasureFrame = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const hover = useSelector((state: RootState) => state.layer.present.hover);

  useEffect(() => {
    // updateMeasureGuides();
    return () => {
      const measureFrame = paperMain.project.getItem({ data: { id: 'measureGuides' } });
      measureFrame.removeChildren();
    }
  }, [selected, hover]);

  return (
    <></>
  );
}

export default MeasureFrame;