import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateMeasureFrameThunk } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface MeasureFrameProps {
  selected?: string[];
  hover?: string;
  updateMeasureFrameThunk?(): void;
}

const MeasureFrame = (props: MeasureFrameProps): ReactElement => {
  const { selected, hover, updateMeasureFrameThunk } = props;

  useEffect(() => {
    updateMeasureFrameThunk();
    return () => {
      const measureFrame = paperMain.project.getItem({ data: { id: 'MeasureFrame' } });
      if (measureFrame) {
        measureFrame.remove();
      }
    }
  }, [selected, hover]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const hover = layer.present.hover;
  return { selected, hover };
};

export default connect(
  mapStateToProps,
  { updateMeasureFrameThunk }
)(MeasureFrame);