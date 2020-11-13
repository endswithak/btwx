import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateMeasureFrame } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface MeasureFrameProps {
  selected?: string[];
  hover?: string;
  updateMeasureFrame?(): void;
}

const MeasureFrame = (props: MeasureFrameProps): ReactElement => {
  const { selected, hover, updateMeasureFrame } = props;

  useEffect(() => {
    updateMeasureFrame();
    return () => {
      const measureFrame = paperMain.project.getItem({ data: { id: 'MeasureFrame' } });
      measureFrame.removeChildren();
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
  { updateMeasureFrame }
)(MeasureFrame);