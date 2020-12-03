import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateMeasureGuides } from '../store/actions/layer';
import { uiPaperScope } from '../canvas';

interface MeasureFrameProps {
  selected?: string[];
  hover?: string;
  updateMeasureGuides?(): void;
}

const MeasureFrame = (props: MeasureFrameProps): ReactElement => {
  const { selected, hover, updateMeasureGuides } = props;

  useEffect(() => {
    updateMeasureGuides();
    return () => {
      const measureFrame = uiPaperScope.project.getItem({ data: { id: 'measureGuides' } });
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
  { updateMeasureGuides }
)(MeasureFrame);