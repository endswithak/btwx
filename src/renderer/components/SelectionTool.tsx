import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { rawRectToPaperRect, paperRectToRawRect, rawPointToPaperPoint, paperPointToRawPoint } from '../utils';
import { setSelectionToolBounds, setSelectionToolHandle, setSelectionToolLineFromPoint, setSelectionToolLineToPoint } from '../store/actions/selectionTool';
import { getSelectedBounds, getSelectedInnerBounds, getSingleLineSelected, getSelectedLineAbsFromPoint, getSelectedLineAbsToPoint } from '../store/selectors/layer';

const SelectionTool = (): ReactElement => {
  const selectedBounds = useSelector((state: RootState) => getSelectedBounds(state));
  const selectedInnerBounds = useSelector((state: RootState) => getSelectedInnerBounds(state));
  const singleLineSelected = useSelector((state: RootState) => getSingleLineSelected(state));
  const selectedLineFromPoint = useSelector((state: RootState) => getSelectedLineAbsFromPoint(state));
  const selectedLineToPoint = useSelector((state: RootState) => getSelectedLineAbsToPoint(state));
  const resizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const dragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const lineHandle = useSelector((state: RootState) => state.canvasSettings.lineHandle);
  const resizeHandle = useSelector((state: RootState) => state.canvasSettings.resizeHandle);
  const dragHandle = useSelector((state: RootState) => state.canvasSettings.dragHandle);
  const selectionBounds = useSelector((state: RootState) => state.selectionTool.bounds);
  const selectionLineFromPoint = useSelector((state: RootState) => state.selectionTool.lineFromPoint);
  const selectionLineToPoint = useSelector((state: RootState) => state.selectionTool.lineToPoint);
  const dispatch = useDispatch();

  useEffect(() => {
    const selectionBoundsRectangle = selectionBounds && rawRectToPaperRect(selectionBounds);
    if ((selectionBoundsRectangle && selectedBounds && !selectionBoundsRectangle.equals(selectedBounds)) || (selectedBounds && !selectionBounds)) {
      dispatch(setSelectionToolBounds({
        bounds: paperRectToRawRect(selectedBounds)
      }));
    }
  }, [selectedBounds, selectedInnerBounds]);

  useEffect(() => {
    const paperSelectionLineFromPoint = selectionLineFromPoint && rawPointToPaperPoint(selectionLineFromPoint);
    if ((paperSelectionLineFromPoint && selectedLineFromPoint && !paperSelectionLineFromPoint.equals(selectedLineFromPoint)) || (selectedLineFromPoint && !selectionLineFromPoint)) {
      dispatch(setSelectionToolLineFromPoint({
        lineFromPoint: paperPointToRawPoint(selectedLineFromPoint)
      }));
    }
  }, [selectedLineFromPoint]);

  useEffect(() => {
    const paperSelectionLineToPoint = selectionLineToPoint && rawPointToPaperPoint(selectionLineToPoint);
    if ((paperSelectionLineToPoint && selectedLineToPoint && !paperSelectionLineToPoint.equals(selectedLineToPoint)) || (selectedLineToPoint && !selectionLineToPoint)) {
      dispatch(setSelectionToolLineToPoint({
        lineToPoint: paperPointToRawPoint(selectedLineToPoint)
      }));
    }
  }, [selectedLineToPoint]);

  useEffect(() => {
    if (!resizing && !dragging) {
      dispatch(setSelectionToolHandle({
        handle: singleLineSelected ? 'lineAll' : 'all'
      }));
    } else {
      if (resizing) {
        dispatch(setSelectionToolHandle({
          handle: singleLineSelected ? lineHandle : resizeHandle
        }));
      }
      if (dragging) {
        dispatch(setSelectionToolHandle({
          handle: dragHandle ? 'move' : 'none'
        }));
      }
    }
  }, [singleLineSelected, selectedBounds, selectedInnerBounds, resizing, dragging, resizeHandle]);

  return null;
}

export default SelectionTool;