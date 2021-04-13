import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedBounds, getSelectedProjectIndices } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/actions/layer';
import { paperMain } from '../canvas';

const SelectionFrame = (): ReactElement => {
  const theme = useSelector((state: RootState) => state.preferences.theme);
  const selectedBounds = useSelector((state: RootState) => getSelectedBounds(state));
  const selectedPaperScopes = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const singleLineHandles = useSelector((state: RootState) => {
    const singleItemSelected = state.layer.present.selected.length === 1;
    const layerItem = singleItemSelected ? state.layer.present.byId[state.layer.present.selected[0]] : null;
    const singleShapeSelected = singleItemSelected && layerItem.type === 'Shape';
    const singleLineSelected = singleShapeSelected && (layerItem as Btwx.Shape).shapeType === 'Line';
    if (singleLineSelected) {
      const lineItem = layerItem as Btwx.Line;
      const artboardItem = state.layer.present.byId[layerItem.artboard];
      return {
        from: {
          x: artboardItem.frame.x + lineItem.from.x,
          y: artboardItem.frame.y + lineItem.from.y
        },
        to: {
          x: artboardItem.frame.x + lineItem.to.x,
          y: artboardItem.frame.y + lineItem.to.y
        }
      }
    } else {
      return null;
    }
  });
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);

  useEffect(() => {
    updateSelectionFrame(selectedBounds, 'all', singleLineHandles);
    return () => {
      const selectionFrame = paperMain.projects[0].getItem({ data: { id: 'selectionFrame' } });
      selectionFrame.removeChildren();
    }
  }, [theme, selectedBounds, singleLineHandles, selectedPaperScopes, zoom]);

  return null;
}

export default SelectionFrame;