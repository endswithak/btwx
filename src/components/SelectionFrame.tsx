import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedBounds, getSelectedProjectIndices, getPaperLayer } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/actions/layer';
import { uiPaperScope } from '../canvas';

const SelectionFrame = (): ReactElement => {
  const theme = useSelector((state: RootState) => state.viewSettings.theme);
  const selectedBounds = useSelector((state: RootState) => getSelectedBounds(state));
  const selectedPaperScopes = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const singleLineSelection = useSelector((state: RootState) => state.layer.present.selected.length === 1 && state.layer.present.byId[state.layer.present.selected[0]].type === 'Shape' && (state.layer.present.byId[state.layer.present.selected[0]] as Btwx.Shape).shapeType === 'Line');
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);

  useEffect(() => {
    const linePaperLayer = singleLineSelection ? getPaperLayer(Object.keys(selectedPaperScopes)[0], selectedPaperScopes[Object.keys(selectedPaperScopes)[0]]) : null;
    updateSelectionFrame(selectedBounds, 'all', linePaperLayer);
    return () => {
      const selectionFrame = uiPaperScope.projects[0].getItem({ data: { id: 'selectionFrame' } });
      selectionFrame.removeChildren();
    }
  }, [theme, selectedBounds, singleLineSelection, selectedPaperScopes, zoom]);

  return (
    <></>
  );
}

export default SelectionFrame;