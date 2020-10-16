import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateSelectionFrameThunk } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface SelectionFrameProps {
  selected?: string[];
  theme?: string;
  selectedBounds?: any;
  updateSelectionFrameThunk?(): void;
}

const SelectionFrame = (props: SelectionFrameProps): ReactElement => {
  const { selected, theme, selectedBounds, updateSelectionFrameThunk } = props;

  useEffect(() => {
    updateSelectionFrameThunk();
    return () => {
      const selectionFrame = paperMain.project.getItem({ data: { id: 'SelectionFrame' } });
      if (selectionFrame) {
        selectionFrame.remove();
      }
    }
  }, [selected, theme, selectedBounds]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  theme: string;
  selectedBounds: any;
} => {
  const { layer, viewSettings } = state;
  const selected = layer.present.selected;
  const theme = viewSettings.theme;
  const selectedBounds = layer.present.selectedBounds;
  return { selected, theme, selectedBounds };
};

export default connect(
  mapStateToProps,
  { updateSelectionFrameThunk }
)(SelectionFrame);