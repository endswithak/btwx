import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedBounds } from '../store/selectors/layer';
import { updateSelectionFrameThunk } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface SelectionFrameProps {
  theme?: string;
  selectedBounds?: any;
  updateSelectionFrameThunk?(): void;
}

const SelectionFrame = (props: SelectionFrameProps): ReactElement => {
  const { theme, updateSelectionFrameThunk, selectedBounds } = props;

  useEffect(() => {
    updateSelectionFrameThunk();
    return () => {
      const selectionFrame = paperMain.project.getItem({ data: { id: 'SelectionFrame' } });
      if (selectionFrame) {
        selectionFrame.remove();
      }
    }
  }, [theme, selectedBounds]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  theme: string;
  selectedBounds: any;
} => {
  const { viewSettings } = state;
  const theme = viewSettings.theme;
  const selectedBounds = getSelectedBounds(state);
  return { theme, selectedBounds };
};

export default connect(
  mapStateToProps,
  { updateSelectionFrameThunk }
)(SelectionFrame);