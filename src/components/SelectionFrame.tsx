import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedBounds } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface SelectionFrameProps {
  theme?: string;
  selectedBounds?: any;
}

const SelectionFrame = (props: SelectionFrameProps): ReactElement => {
  const { theme, selectedBounds } = props;

  useEffect(() => {
    updateSelectionFrame();
    return () => {
      const selectionFrame = paperMain.projects[1].getItem({ data: { id: 'selectionFrame' } });
      selectionFrame.removeChildren();
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
  mapStateToProps
)(SelectionFrame);