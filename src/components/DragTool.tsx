/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getHoverBounds, getPaperLayer, getSelectedBounds, getSelectedById } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasActiveTool, setCanvasDragging } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasDraggingPayload, SetCanvasActiveToolPayload } from '../store/actionTypes/canvasSettings';
import { moveLayersBy, duplicateLayers, removeDuplicatedLayers } from '../store/actions/layer';
import { LayerTypes, MoveLayersByPayload, DuplicateLayersPayload, RemoveDuplicatedLayersPayload } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';

interface DragToolProps {
  hover?: string;
  selected?: string[];
  selectedById?: {
    [id: string]: Btwx.Layer;
  };
  isEnabled?: boolean;
  selectedBounds?: paper.Rectangle;
  hoverBounds?: paper.Rectangle;
  dragging?: boolean;
  setCanvasDragging?(payload: SetCanvasDraggingPayload): CanvasSettingsTypes;
  moveLayersBy?(payload: MoveLayersByPayload): LayerTypes;
  duplicateLayers?(payload: DuplicateLayersPayload): LayerTypes;
  removeDuplicatedLayers?(payload: RemoveDuplicatedLayersPayload): LayerTypes;
  setCanvasActiveTool?(payload: SetCanvasActiveToolPayload): CanvasSettingsTypes;
}

const DragTool = (props: DragToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, hover, hoverBounds, setCanvasDragging, dragging, selected, moveLayersBy, setCanvasActiveTool, selectedById, selectedBounds } = props;
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
    const dragLayers = selected.length > 0 ? selected : hover;
    const dragLayersBounds = selected.length > 0 ? selectedBounds : hoverBounds;
    setOriginalSelection(dragLayers);
    setFromBounds(dragLayersBounds);
    setFrom(e.point);
    setTo(e.point);
    setToBounds(dragLayersBounds);
  }

  const handleMouseDrag = (e: paper.ToolEvent): void => {
    if (!dragging) {
      setCanvasDragging({dragging: true});
    }
    const nextX = x + e.delta.x;
    const nextY = y + e.delta.y;
    const nextToBounds = {
      ...toBounds,
      center: {
        ...toBounds.center,
        x: fromBounds.center.x + nextX,
        y: fromBounds.center.y + nextY,
      }
    }
    setX(nextX);
    setY(nextY);
    setTo(e.point);
    setToBounds(nextToBounds);
    const translate = {
      x: nextToBounds.center.x - fromBounds.center.x,
      y: nextToBounds.center.y - fromBounds.center.y
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
    if (dragging) {
      setCanvasDragging({dragging: false});
    }
    resetState();
  }

  useEffect(() => {
    if (tool) {
      tool.onMouseDown = handleMouseDown;
      tool.onMouseDrag = handleMouseDrag;
      tool.onMouseUp = handleMouseUp;
    }
  }, [toBounds, dragging, selectedBounds, hoverBounds, isEnabled]);

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

const mapStateToProps = (state: RootState): {
  hover: string;
  selected: string[];
  isEnabled: boolean;
  selectedById: {
    [id: string]: Btwx.Layer;
  };
  selectedBounds: paper.Rectangle;
  hoverBounds: paper.Rectangle;
  dragging: boolean;
} => {
  const { layer, canvasSettings } = state;
  const hover = layer.present.hover;
  const selected = layer.present.selected;
  const isEnabled = canvasSettings.activeTool === 'Drag';
  const selectedById = getSelectedById(state);
  const selectedBounds = getSelectedBounds(state);
  const hoverBounds = getHoverBounds(state);
  const dragging = canvasSettings.dragging;
  return {
    hover,
    selected,
    isEnabled,
    selectedById,
    selectedBounds,
    hoverBounds,
    dragging
  };
};

export default connect(
  mapStateToProps,
  { moveLayersBy, duplicateLayers, removeDuplicatedLayers, setCanvasActiveTool, setCanvasDragging }
)(DragTool);