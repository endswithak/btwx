import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateSelectionFrameThunk } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface SelectionFrameProps {
  theme?: string;
  updateSelectionFrameThunk?(): void;
}

const SelectionFrame = (props: SelectionFrameProps): ReactElement => {
  const { theme, updateSelectionFrameThunk } = props;

  useEffect(() => {
    updateSelectionFrameThunk();
    return () => {
      const selectionFrame = paperMain.project.getItem({ data: { id: 'SelectionFrame' } });
      if (selectionFrame) {
        selectionFrame.remove();
      }
    }
  }, [theme]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  theme: string;
} => {
  const { viewSettings } = state;
  const theme = viewSettings.theme;
  return { theme };
};

export default connect(
  mapStateToProps,
  { updateSelectionFrameThunk }
)(SelectionFrame);