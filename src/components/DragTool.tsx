/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { scrollToLayer } from '../utils';
import { RootState } from '../store/reducers';
import { importPaperProject, getDeepSelectItem, getNearestScopeAncestor, getSelectionBounds, getPaperLayer } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasActiveTool } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasActiveToolPayload } from '../store/actionTypes/canvasSettings';
import { moveLayersBy, duplicateLayers, removeDuplicatedLayers } from '../store/actions/layer';
import { LayerTypes, MoveLayersByPayload, DuplicateLayersPayload, RemoveDuplicatedLayersPayload } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import { getSelectedById } from '../store/selectors';

interface DragToolProps {
  hitResult: {
    hitResult: paper.HitResult;
    empty: boolean;
    eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu';
    event: any;
  };
  layerItem?: em.Layer;
  nearestScopeAncestor?: em.Layer;
  deepSelectItem?: em.Layer;
  hover?: string;
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
  const { hitResult, isEnabled, hover, selected, moveLayersBy, layerItem, nearestScopeAncestor, deepSelectItem, duplicateLayers, removeDuplicatedLayers, setCanvasActiveTool, selectedById } = props;
  const [originalSelection, setOriginalSelection] = useState(null);
  const [duplicateSelection, setDuplicateSelection] = useState(null);
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [fromBounds, setFromBounds] = useState(null);
  const [toBounds, setToBounds] = useState(null);

  const handleMouseDown = (): void => {
    if (!hitResult.empty) {
      if (nearestScopeAncestor.type !== 'Artboard' || deepSelectItem.type !== 'Artboard') {
        setCanvasActiveTool({activeTool: 'Drag', dragging: true});
        paperMain.tool.onMouseDown = handleToolMouseDown;
        paperMain.tool.onMouseDrag = handleToolMouseDrag;
        paperMain.tool.onMouseUp = handleToolMouseUp;
        paperMain.tool.emit('mousedown', hitResult.event);
      }
    }
  }

  const handleMouseUp = (): void => {

  }

  const handleToolMouseDown = (e: paper.ToolEvent): void => {
    const selectionBounds = getSelectionBounds(selected);
    setOriginalSelection(selected);
    setFromBounds(selectionBounds);
    setFrom(e.point);
    setTo(e.point);
    setToBounds(new paperMain.Rectangle(selectionBounds));
  }

  const handleToolMouseDrag = (e: paper.ToolEvent): void => {
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

  const handleToolMouseUp = (e: paper.ToolEvent): void => {

  }

  useEffect(() => {
    if (hitResult) {
      switch(hitResult.eventType) {
        case 'mouseDown':
          handleMouseDown();
          break;
        case 'mouseUp':
          handleMouseUp();
          break;
      }
    }
  }, [hitResult]);

  return (
    <div />
  );
}

const mapStateToProps = (state: RootState, ownProps: DragToolProps): {
  layerItem: em.Layer;
  nearestScopeAncestor: em.Layer;
  deepSelectItem: em.Layer;
  hover: string;
  selected: string[];
  isEnabled: boolean;
  selectedById: {
    [id: string]: em.Layer;
  };
} => {
  const { layer, canvasSettings } = state;
  const hitResult = ownProps.hitResult;
  const result = hitResult ? ownProps.hitResult.hitResult : null;
  const layerItem = hitResult && !hitResult.empty ? layer.present.byId[result.item.data.type === 'Layer' ? result.item.data.id : result.item.parent.data.id] : null;
  const nearestScopeAncestor = layerItem ? getNearestScopeAncestor(layer.present, layerItem.id) : null;
  const deepSelectItem = layerItem ? getDeepSelectItem(layer.present, layerItem.id) : null;
  const hover = layer.present.hover;
  const selected = layer.present.selected;
  const isEnabled = canvasSettings.activeTool === 'Drag';
  const selectedById = selected.reduce((result: {[id: string]: em.Layer}, current) => {
    result[current] = layer.present.byId[current];
    return result;
  }, {});
  return {
    layerItem,
    nearestScopeAncestor,
    deepSelectItem,
    hover,
    selected,
    isEnabled,
    selectedById
  };
};

export default connect(
  mapStateToProps,
  { moveLayersBy, duplicateLayers, removeDuplicatedLayers, setCanvasActiveTool }
)(DragTool);