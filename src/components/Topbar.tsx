import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { enableSelectionTool, enableRectangleShapeTool, enableEllipseShapeTool, enableStarShapeTool, enablePolygonShapeTool, enableRoundedShapeTool, enableArtboardTool, enableTextTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { openTweenDrawer, closeTweenDrawer } from '../store/actions/tweenDrawer';
import { TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { AddLayersMaskPayload, LayerTypes } from '../store/actionTypes/layer';
import { addLayersMask } from '../store/actions/layer';
import { orderLayersByDepth } from '../store/selectors/layer';
import { ToolState } from '../store/reducers/tool';
import { ThemeContext } from './ThemeProvider';
import { ipcRenderer } from 'electron';
import TopbarButton from './TopbarButton';

interface TopbarStateProps {
  tool: ToolState;
  activeArtboard: em.Artboard;
  isTweenDrawerOpen: boolean;
  selected: string[];
  canMask: boolean;
  enableRectangleShapeTool(): ToolTypes;
  enableEllipseShapeTool(): ToolTypes;
  enableStarShapeTool(): ToolTypes;
  enablePolygonShapeTool(): ToolTypes;
  enableRoundedShapeTool(): ToolTypes;
  enableSelectionTool(): ToolTypes;
  enableArtboardTool(): ToolTypes;
  enableTextTool(): ToolTypes;
  openTweenDrawer(): TweenDrawerTypes;
  closeTweenDrawer(): TweenDrawerTypes;
  addLayersMask(payload: AddLayersMaskPayload): LayerTypes;
}

const Topbar = (props: TopbarStateProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const {
    tool,
    isTweenDrawerOpen,
    selected,
    canMask,
    enableRectangleShapeTool,
    enableEllipseShapeTool,
    enableSelectionTool,
    enableStarShapeTool,
    enablePolygonShapeTool,
    enableRoundedShapeTool,
    enableArtboardTool,
    activeArtboard,
    enableTextTool,
    openTweenDrawer,
    closeTweenDrawer,
    addLayersMask
  } = props;

  const handlePreviewClick = () => {
    ipcRenderer.send('openPreview', JSON.stringify(activeArtboard));
  }

  const handleMaskClick = () => {
    if (canMask) {
      addLayersMask({layers: selected});
    }
  }

  return (
    <div
      className='c-topbar'
      style={{
        background: theme.background.z1,
        boxShadow: `0 -1px 0 0 ${theme.background.z3} inset`
      }}>
      <TopbarButton
        onClick={enableArtboardTool}
        icon='M12.4743416,2.84188612 L12.859,3.99988612 L21,4 L21,15 L22,15 L22,16 L16.859,15.9998861 L18.4743416,20.8418861 L17.5256584,21.1581139 L16.805,18.9998861 L7.193,18.9998861 L6.47434165,21.1581139 L5.52565835,20.8418861 L7.139,15.9998861 L2,16 L2,15 L3,15 L3,4 L11.139,3.99988612 L11.5256584,2.84188612 L12.4743416,2.84188612 Z M15.805,15.9998861 L8.193,15.9998861 L7.526,17.9998861 L16.472,17.9998861 L15.805,15.9998861 Z M20,5 L4,5 L4,15 L20,15 L20,5 Z'
        isActive={tool.type === 'Artboard'} />
      <TopbarButton
        onClick={tool.type === 'Shape' && tool.shapeToolType === 'Rectangle' ? enableSelectionTool : enableRectangleShapeTool}
        icon='M4,4 L19.999,4 C19.9995523,4 20,4.00044772 20,4.001 L20,20 L20,20 L4,20 L4,4 Z'
        isActive={tool.type === 'Shape' && tool.shapeToolType === 'Rectangle'} />
      <TopbarButton
        onClick={tool.type === 'Shape' && tool.shapeToolType === 'Rounded' ? enableSelectionTool : enableRoundedShapeTool}
        icon='M7.55555556,4 L16.4444444,4 C18.4081236,4 20,5.59187645 20,7.55555556 L20,16.4444444 C20,18.4081236 18.4081236,20 16.4444444,20 L7.55555556,20 C5.59187645,20 4,18.4081236 4,16.4444444 L4,7.55555556 C4,5.59187645 5.59187645,4 7.55555556,4 Z'
        isActive={tool.type === 'Shape' && tool.shapeToolType === 'Rounded'} />
      <TopbarButton
        onClick={tool.type === 'Shape' && tool.shapeToolType === 'Ellipse' ? enableSelectionTool : enableEllipseShapeTool}
        icon='M12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 Z'
        isActive={tool.type === 'Shape' && tool.shapeToolType === 'Ellipse'} />
      <TopbarButton
        onClick={tool.type === 'Shape' && tool.shapeToolType === 'Star' ? enableSelectionTool : enableStarShapeTool}
        icon='M12,17.9252329 L6.4376941,21 L7.5,14.4875388 L3,9.8753882 L9.21884705,8.92523292 L11.9990948,3.00192861 C11.9993294,3.00142866 11.9999249,3.0012136 12.0004249,3.00144827 C12.0006362,3.00154743 12.0008061,3.00171735 12.0009052,3.00192861 L14.7811529,8.92523292 L14.7811529,8.92523292 L21,9.8753882 L16.5,14.4875388 L17.5623059,21 L12,17.9252329 Z'
        isActive={tool.type === 'Shape' && tool.shapeToolType === 'Star'} />
      <TopbarButton
        onClick={tool.type === 'Shape' && tool.shapeToolType === 'Polygon' ? enableSelectionTool : enablePolygonShapeTool}
        icon='M12.0006071,3.00046375 L20.9994457,9.87496475 C20.9997787,9.87521916 20.9999178,9.87565424 20.9997941,9.87605465 L17.5625237,20.9992952 C17.5623942,20.9997142 17.5620068,21 17.5615683,21 L6.43843174,21 C6.43799318,21 6.4376058,20.9997142 6.43747632,20.9992952 L3.00020594,9.87605465 C3.00008221,9.87565424 3.00022128,9.87521916 3.0005543,9.87496475 L11.9993929,3.00046375 C11.9997513,3.00018996 12.0002487,3.00018996 12.0006071,3.00046375 Z'
        isActive={tool.type === 'Shape' && tool.shapeToolType === 'Polygon'} />
      <TopbarButton
        onClick={tool.type === 'Text' ? enableSelectionTool : enableTextTool}
        icon='M12.84,18.999 L12.84,6.56 L12.84,6.56 L16.92,6.56 L16.92,5 L7.08,5 L7.08,6.56 L11.16,6.56 L11.16,19 L12.839,19 C12.8395523,19 12.84,18.9995523 12.84,18.999 Z'
        isActive={tool.type === 'Text'} />
      <TopbarButton
        onClick={handlePreviewClick}
        icon='M19.5,12 L6.5,20 L6.5,4.00178956 C6.5,4.00123728 6.50044772,4.00078956 6.501,4.00078956 C6.50118506,4.00078956 6.50136649,4.00084092 6.5015241,4.00093791 L19.5,12 L19.5,12 Z' />
      <TopbarButton
        onClick={isTweenDrawerOpen ? closeTweenDrawer : openTweenDrawer}
        icon='M13,17 L13,19 L7,19 L7,17 L13,17 Z M17,17 L17,19 L15,19 L15,17 L17,17 Z M5,17 L5,19 L3,19 L3,17 L5,17 Z M19,11 L19,13 L17,13 L17,11 L19,11 Z M5,11 L5,13 L3,13 L3,11 L5,11 Z M15,11 L15,13 L7,13 L7,11 L15,11 Z M17,5 L17,7 L7,7 L7.00166667,5 L7.00166667,5 L17,5 Z M21,5 L21,7 L19,7 L19,5 L21,5 Z M5,5 L5,7 L3,7 L3,5 L5,5 Z'
        isActive={isTweenDrawerOpen} />
      <TopbarButton
        onClick={handleMaskClick}
        icon='M20,19.5 L20,20.5 L18,20.5 L18,19.5 L20,19.5 Z M16,19.5 L16,20.5 L14,20.5 L14,19.5 L16,19.5 Z M12,19.5 L12,20.5 L10,20.5 L10,19.5 L12,19.5 Z M8,19.5 L8,20.5 L6,20.5 L6,19.5 L8,19.5 Z M4.5,18 L4.5,20 L3.5,20 L3.5,18 L4.5,18 Z M17.5,8 C17.6678058,8 17.8345954,8.00435077 18.0002622,8.01294566 L18,18 L8.01294566,18.0002622 C8.00435077,17.8345954 8,17.6678058 8,17.5 C8,12.2532949 12.2532949,8 17.5,8 Z M20.5,16 L20.5,18 L19.5,18 L19.5,16 L20.5,16 Z M4.5,14 L4.5,16 L3.5,16 L3.5,14 L4.5,14 Z M20.5,12 L20.5,14 L19.5,14 L19.5,12 L20.5,12 Z M4.5,10 L4.5,12 L3.5,12 L3.5,10 L4.5,10 Z M20.5,8 L20.5,10 L19.5,10 L19.5,8 L20.5,8 Z M4.5,6 L4.5,8 L3.5,8 L3.5,6 L4.5,6 Z M20.5,4 L20.5,6 L19.5,6 L19.5,4 L20.5,4 Z M6,3.5 L6,4.5 L4,4.5 L4,3.5 L6,3.5 Z M10,3.5 L10,4.5 L8,4.5 L8,3.5 L10,3.5 Z M14,3.5 L14,4.5 L12,4.5 L12,3.5 L14,3.5 Z M18,3.5 L18,4.5 L16,4.5 L16,3.5 L18,3.5 Z'
        disabled={!canMask} />
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { tool, layer, tweenDrawer } = state;
  const activeArtboard = layer.present.byId[layer.present.activeArtboard];
  const isTweenDrawerOpen = tweenDrawer.isOpen;
  const selected = layer.present.selected;
  const selectedById: {[id: string]: em.Page | em.Artboard | em.Group | em.Shape | em.Text} = selected.reduce((result, current) => {
    result = {
      ...result,
      [current]: layer.present.byId[current]
    }
    return result;
  }, {});
  const selectedByDepth = orderLayersByDepth(state.layer.present, selected);
  const canMask = selected.length > 0 && selectedById[selectedByDepth[0]].type === 'Shape';
  return { tool, activeArtboard, isTweenDrawerOpen, selected, canMask };
};

export default connect(
  mapStateToProps,
  {
    enableRectangleShapeTool,
    enableEllipseShapeTool,
    enableStarShapeTool,
    enablePolygonShapeTool,
    enableRoundedShapeTool,
    enableSelectionTool,
    enableArtboardTool,
    enableTextTool,
    openTweenDrawer,
    closeTweenDrawer,
    addLayersMask
  }
)(Topbar);