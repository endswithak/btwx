import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedBounds, getSelectedProjectIndices, getPaperLayer } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/actions/layer';
import { uiPaperScope } from '../canvas';

interface SelectionFrameProps {
  theme?: string;
  selectedBounds?: paper.Rectangle;
  selectedPaperScopes?: {
    [id: string]: number;
  };
  isLine?: boolean;
  zoom?: number;
}

const SelectionFrame = (props: SelectionFrameProps): ReactElement => {
  const { theme, selectedBounds, isLine, selectedPaperScopes, zoom } = props;

  useEffect(() => {
    const linePaperLayer = isLine ? getPaperLayer(Object.keys(selectedPaperScopes)[0], selectedPaperScopes[Object.keys(selectedPaperScopes)[0]]) : null;
    updateSelectionFrame(selectedBounds, 'all', linePaperLayer);
    return () => {
      const selectionFrame = uiPaperScope.projects[0].getItem({ data: { id: 'selectionFrame' } });
      selectionFrame.removeChildren();
    }
  }, [theme, selectedBounds, isLine, selectedPaperScopes, zoom]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  theme: string;
  selectedBounds: paper.Rectangle;
  selectedPaperScopes: {
    [id: string]: number;
  };
  isLine: boolean;
  zoom: number;
} => {
  const { viewSettings, layer, documentSettings } = state;
  const theme = viewSettings.theme;
  const selectedBounds = getSelectedBounds(state);
  const selectedPaperScopes = getSelectedProjectIndices(state);
  const singleSelection = layer.present.selected.length === 1;
  const isLine = singleSelection && state.layer.present.byId[layer.present.selected[0]].type === 'Shape' && (state.layer.present.byId[layer.present.selected[0]] as Btwx.Shape).shapeType === 'Line';
  const zoom = documentSettings.zoom;
  return { theme, selectedBounds, isLine, selectedPaperScopes, zoom };
};

export default connect(
  mapStateToProps
)(SelectionFrame);