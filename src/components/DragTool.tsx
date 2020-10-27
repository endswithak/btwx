/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getDeepSelectItem, getNearestScopeAncestor, getSelectionBounds, getPaperLayer } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasActiveTool } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasActiveToolPayload } from '../store/actionTypes/canvasSettings';
import { moveLayersBy, duplicateLayers, removeDuplicatedLayers } from '../store/actions/layer';
import { LayerTypes, MoveLayersByPayload, DuplicateLayersPayload, RemoveDuplicatedLayersPayload } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';

interface DragToolProps {
  selected?: string[];
  selectedById?: {
    [id: string]: em.Layer;
  };
  isEnabled?: boolean;
  moveLayersBy?(payload: MoveLayersByPayload): LayerTypes;
  duplicateLayers?(payload: DuplicateLayersPayload): LayerTypes;
  removeDuplicatedLayers?(payload: RemoveDuplicatedLayersPayload): LayerTypes;
  setCanvasActiveTool?(payload: SetCanvasActiveToolPayload): CanvasSettingsTypes;
}

const DragTool = (props: DragToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, selected, moveLayersBy, setCanvasActiveTool, selectedById } = props;
  const [tool, setTool] = useState<paper.Tool>(null);
  const [originalSelection, setOriginalSelection] = useState(null);
  const [duplicateSelection, setDuplicateSelection] = useState(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [fromBounds, setFromBounds] = useState(null);
  const [toBounds, setToBounds] = useState(null);

  const resetState = () => {
    setOriginalSelection(null);
    setDuplicateSelection(null);
    setFrom(null);
    setTo(null);
    setX(0);
    setY(0);
    setToBounds(null);
    setFromBounds(null);
  }

  const handleMouseDown = (e: paper.ToolEvent): void => {
    const selectionBounds = getSelectionBounds(selected);
    setOriginalSelection(selected);
    setFromBounds(selectionBounds);
    setFrom(e.point);
    setTo(e.point);
    setToBounds(new paperMain.Rectangle(selectionBounds));
  }

  const handleMouseDrag = (e: paper.ToolEvent): void => {
    let initialToBounds;
    let initialFromBounds;
    let initialFrom;
    let initialTo;
    if (!originalSelection) {
      initialFrom = e.point;
      initialTo = e.point;
      initialFromBounds = getSelectionBounds(selected);
      initialToBounds = new paperMain.Rectangle(initialFromBounds);
      setOriginalSelection(selected);
      setFromBounds(initialFromBounds);
      setFrom(initialFrom);
      setTo(initialTo);
      setToBounds(initialToBounds);
    }
    const nextX = x + e.delta.x;
    const nextY = y + e.delta.y;
    const nextToBounds = {
      ...(toBounds ? toBounds : initialToBounds),
      center: {
        ...(toBounds ? toBounds : initialToBounds).center,
        x: (fromBounds ? fromBounds.center.x : initialFromBounds.center.x) + nextX,
        y: (fromBounds ? fromBounds.center.y : initialFromBounds.center.y) + nextY,
      }
    }
    setX(nextX);
    setY(nextY);
    setTo(e.point);
    setToBounds(nextToBounds);
    const translate = {
      x: nextToBounds.center.x - (fromBounds ? fromBounds.center.x : initialFromBounds.center.x),
      y: nextToBounds.center.y - (fromBounds ? fromBounds.center.y : initialFromBounds.center.y)
    };
    selected.forEach((id) => {
      const paperLayer = getPaperLayer(id);
      const layerItem = selectedById[id];
      paperLayer.position.x = layerItem.frame.x + translate.x;
      paperLayer.position.y = layerItem.frame.y + translate.y;
    });
  }

  const handleMouseUp = (e: paper.ToolEvent): void => {
    if (selected.length > 0 && (x !== 0 || y !== 0)) {
      moveLayersBy({layers: selected, x: x, y: y});
    }
    paperMain.tool = null;
    setCanvasActiveTool({activeTool: null, drawing: false});
    resetState();
  }

  useEffect(() => {
    if (isEnabled) {
      tool.onMouseDrag = handleMouseDrag;
      tool.onMouseUp = handleMouseUp;
    }
  }, [toBounds]);

  useEffect(() => {
    if (isEnabled) {
      if (tool) {
        tool.activate();
      }
    } else {
      paperMain.tool = null;
    }
  }, [isEnabled]);

  useEffect(() => {
    const dragTool = new paperMain.Tool();
    dragTool.onMouseDown = handleMouseDown;
    dragTool.onMouseDrag = handleMouseDrag;
    dragTool.onMouseUp = handleMouseUp;
    setTool(dragTool);
    paperMain.tool = null;
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: DragToolProps): {
  selected: string[];
  isEnabled: boolean;
  selectedById: {
    [id: string]: em.Layer;
  };
} => {
  const { layer, canvasSettings } = state;
  const selected = layer.present.selected;
  const isEnabled = canvasSettings.activeTool === 'Drag';
  const selectedById = selected.reduce((result: {[id: string]: em.Layer}, current) => {
    result[current] = layer.present.byId[current];
    return result;
  }, {});
  return {
    selected,
    isEnabled,
    selectedById
  };
};

export default connect(
  mapStateToProps,
  { moveLayersBy, duplicateLayers, removeDuplicatedLayers, setCanvasActiveTool }
)(DragTool);