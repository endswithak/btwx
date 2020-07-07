import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { paperMain } from '../canvas';
import { enableSelectionTool, enableRectangleShapeTool, enableEllipseShapeTool, enableStarShapeTool, enablePolygonShapeTool, enableRoundedShapeTool, enableArtboardTool, enableTextTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { openTweenDrawer, closeTweenDrawer } from '../store/actions/tweenDrawer';
import { TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { AddImagePayload, AddLayersMaskPayload, GroupLayersPayload, UngroupLayersPayload, SendLayersBackwardPayload, SendLayersForwardPayload, LayerTypes } from '../store/actionTypes/layer';
import { addImage, addLayersMask, groupLayers, ungroupLayers, sendLayersBackward, sendLayersForward } from '../store/actions/layer';
import { orderLayersByDepth } from '../store/selectors/layer';
import { ToolState } from '../store/reducers/tool';
import { ThemeContext } from './ThemeProvider';
import { ipcRenderer, remote } from 'electron';
import TopbarButton from './TopbarButton';
import TopbarDropdownButton from './TopbarDropdownButton';

interface TopbarStateProps {
  tool: ToolState;
  activeArtboard: em.Artboard;
  isTweenDrawerOpen: boolean;
  selected: string[];
  canMask: boolean;
  canMoveBackward: boolean;
  canMoveForward: boolean;
  canGroup: boolean;
  canUngroup: boolean;
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
  groupLayers(payload: GroupLayersPayload): LayerTypes;
  ungroupLayers(payload: UngroupLayersPayload): LayerTypes;
  sendLayersBackward(payload: SendLayersBackwardPayload): LayerTypes;
  sendLayersForward(payload: SendLayersForwardPayload): LayerTypes;
  addImage(payload: AddImagePayload): LayerTypes;
}

const Topbar = (props: TopbarStateProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const {
    tool,
    isTweenDrawerOpen,
    selected,
    canMask,
    canMoveBackward,
    canMoveForward,
    canGroup,
    canUngroup,
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
    addLayersMask,
    groupLayers,
    ungroupLayers,
    sendLayersBackward,
    sendLayersForward,
    addImage
  } = props;

  const handlePreviewClick = () => {
    ipcRenderer.send('openPreview', JSON.stringify(activeArtboard));
  }

  const handleMaskClick = () => {
    if (canMask) {
      addLayersMask({layers: selected});
    }
  }

  const handleMoveForwardClick = () => {
    if (canMoveForward) {
      sendLayersForward({layers: selected});
    }
  }

  const handleMoveBackwardClick = () => {
    if (canMoveBackward) {
      sendLayersBackward({layers: selected});
    }
  }

  const handleGroupClick = () => {
    if (canGroup) {
      groupLayers({layers: selected});
    }
  }

  const handleUngroupClick = () => {
    if (canUngroup) {
      ungroupLayers({layers: selected});
    }
  }

  const handleImageClick = () => {
    ipcRenderer.send('addImage');
    ipcRenderer.once('addImage-reply', (event, arg) => {
      const buffer = Buffer.from(JSON.parse(arg).data);
      const base64 = btoa(
        new Uint8Array(buffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const paperLayer = new paperMain.Raster(`data:image/jpg;base64,${base64}`);
      paperLayer.position = paperMain.view.center;
      paperLayer.onLoad = () => {
        addImage({source: null, paperLayer});
      }
    });
  }

  return (
    <div
      className='c-topbar'
      style={{
        background: theme.background.z1,
        boxShadow: `0 -1px 0 0 ${theme.background.z3} inset`
      }}>
      <div className='c-topbar__button-group'>
        <TopbarDropdownButton
          label='Insert'
          icon='M13,4 L12.999,11 L19.999,11 C19.9995523,11 20,11.0004477 20,11.001 L20,13 L20,13 L12.999,13 L13,20 L11,20 L10.999,12.999 L4,13 L4,11 L10.999,10.999 L11,4 L13,4 Z'
          options={[{
            label: 'Artboard',
            onClick: tool.type === 'Artboard' ? enableSelectionTool : enableArtboardTool,
            icon: 'M12.4743416,2.84188612 L12.859,3.99988612 L21,4 L21,15 L22,15 L22,16 L16.859,15.9998861 L18.4743416,20.8418861 L17.5256584,21.1581139 L16.805,18.9998861 L7.193,18.9998861 L6.47434165,21.1581139 L5.52565835,20.8418861 L7.139,15.9998861 L2,16 L2,15 L3,15 L3,4 L11.139,3.99988612 L11.5256584,2.84188612 L12.4743416,2.84188612 Z M15.805,15.9998861 L8.193,15.9998861 L7.526,17.9998861 L16.472,17.9998861 L15.805,15.9998861 Z M20,5 L4,5 L4,15 L20,15 L20,5 Z',
            isActive: tool.type === 'Artboard'
          },{
            label: 'Rectangle',
            onClick: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle' ? enableSelectionTool : enableRectangleShapeTool,
            icon: 'M4,4 L19.999,4 C19.9995523,4 20,4.00044772 20,4.001 L20,20 L20,20 L4,20 L4,4 Z',
            isActive: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle'
          },{
            label: 'Rounded',
            onClick: tool.type === 'Shape' && tool.shapeToolType === 'Rounded' ? enableSelectionTool : enableRoundedShapeTool,
            icon: 'M7.55555556,4 L16.4444444,4 C18.4081236,4 20,5.59187645 20,7.55555556 L20,16.4444444 C20,18.4081236 18.4081236,20 16.4444444,20 L7.55555556,20 C5.59187645,20 4,18.4081236 4,16.4444444 L4,7.55555556 C4,5.59187645 5.59187645,4 7.55555556,4 Z',
            isActive: tool.type === 'Shape' && tool.shapeToolType === 'Rounded'
          },{
            label: 'Ellipse',
            onClick: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse' ? enableSelectionTool : enableEllipseShapeTool,
            icon: 'M12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 Z',
            isActive: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse'
          },{
            label: 'Star',
            onClick: tool.type === 'Shape' && tool.shapeToolType === 'Star' ? enableSelectionTool : enableStarShapeTool,
            icon: 'M12,17.9252329 L6.4376941,21 L7.5,14.4875388 L3,9.8753882 L9.21884705,8.92523292 L11.9990948,3.00192861 C11.9993294,3.00142866 11.9999249,3.0012136 12.0004249,3.00144827 C12.0006362,3.00154743 12.0008061,3.00171735 12.0009052,3.00192861 L14.7811529,8.92523292 L14.7811529,8.92523292 L21,9.8753882 L16.5,14.4875388 L17.5623059,21 L12,17.9252329 Z',
            isActive: tool.type === 'Shape' && tool.shapeToolType === 'Star'
          },{
            label: 'Polygon',
            onClick: tool.type === 'Shape' && tool.shapeToolType === 'Polygon' ? enableSelectionTool : enablePolygonShapeTool,
            icon: 'M12.0006071,3.00046375 L20.9994457,9.87496475 C20.9997787,9.87521916 20.9999178,9.87565424 20.9997941,9.87605465 L17.5625237,20.9992952 C17.5623942,20.9997142 17.5620068,21 17.5615683,21 L6.43843174,21 C6.43799318,21 6.4376058,20.9997142 6.43747632,20.9992952 L3.00020594,9.87605465 C3.00008221,9.87565424 3.00022128,9.87521916 3.0005543,9.87496475 L11.9993929,3.00046375 C11.9997513,3.00018996 12.0002487,3.00018996 12.0006071,3.00046375 Z',
            isActive: tool.type === 'Shape' && tool.shapeToolType === 'Polygon'
          },{
            label: 'Text',
            onClick: tool.type === 'Text' ? enableSelectionTool : enableTextTool,
            icon: 'M12.84,18.999 L12.84,6.56 L12.84,6.56 L16.92,6.56 L16.92,5 L7.08,5 L7.08,6.56 L11.16,6.56 L11.16,19 L12.839,19 C12.8395523,19 12.84,18.9995523 12.84,18.999 Z',
            isActive: tool.type === 'Text'
          },{
            label: 'Image',
            onClick: handleImageClick,
            icon: theme.name === 'dark' ? 'M21,3 L21,21 L3,21 L3,3 L21,3 Z M20.1,3.9 L3.9,3.9 L3.9,16.16 L7.5,12.2 L12.765,17.991 L16.05,14.9 L20.1,18.712 L20.1,3.9 Z M16.05,5.7 C17.2926407,5.7 18.3,6.70735931 18.3,7.95 C18.3,9.19264069 17.2926407,10.2 16.05,10.2 C15.729854,10.2 15.4253249,10.1331365 15.1496154,10.0126123 C15.9443605,9.66600335 16.5,8.87288995 16.5,7.95 C16.5,7.02711005 15.9443605,6.23399665 15.1493633,5.8869416 C15.4253249,5.76686354 15.729854,5.7 16.05,5.7 Z' : 'M21,3 L21,21 L3,21 L3,3 L21,3 Z M20.1,3.9 L3.9,3.9 L3.9,16.16 L7.5,12.2 L12.765,17.991 L16.05,14.9 L20.1,18.712 L20.1,3.9 Z M16.05,5.7 C17.2926407,5.7 18.3,6.70735931 18.3,7.95 C18.3,9.19264069 17.2926407,10.2 16.05,10.2 C14.8073593,10.2 13.8,9.19264069 13.8,7.95 C13.8,6.70735931 14.8073593,5.7 16.05,5.7 Z',
          }]} />
      </div>
      <div className='c-topbar__button-group'>
        <TopbarButton
          label='Mask'
          onClick={handleMaskClick}
          icon='M16.0566792,20.6980024 L16.3546361,21.6525817 C15.847026,21.8109856 15.3228978,21.9186671 14.7880039,21.973513 L14.3849047,22.0047076 L14.2171817,22.0117647 L14.1856696,21.0122613 L14.3325688,21.0060781 C14.8118374,20.9809607 15.2773132,20.9082021 15.7246478,20.7926318 L16.0566792,20.6980024 Z M10.3532316,20.0120132 C10.8264008,20.2976977 11.3353999,20.5286987 11.8710558,20.6967565 L12.1955747,20.7899719 L11.943458,21.7576689 C11.3244785,21.5960954 10.7289235,21.3607684 10.1685017,21.0579417 L9.83655827,20.8681959 L10.3532316,20.0120132 Z M19.4250036,18.3977506 L20.2048142,19.0237662 C19.80557,19.5207976 19.3485694,19.9686742 18.8440721,20.357346 L18.5357562,20.5833641 L17.9641611,19.7628282 C18.4230149,19.4429846 18.8410556,19.0699031 19.2097655,18.6530438 L19.4250036,18.3977506 Z M7.6653983,17.0693693 C7.91084113,17.5752374 8.21510088,18.0461686 8.56885344,18.4737675 L8.78696952,18.7250598 L8.04721755,19.3979396 C7.61793,18.9263246 7.2462845,18.4052716 6.94076601,17.8456772 L6.76545803,17.5053828 L7.6653983,17.0693693 Z M20.9313679,14.7231376 L21.9264404,14.8222895 C21.8624145,15.461036 21.722005,16.0857225 21.5096386,16.685155 L21.3736192,17.0416944 L20.4482102,16.6627245 C20.6561457,16.1545199 20.8058021,15.6173329 20.8892833,15.0599329 L20.9313679,14.7231376 Z M2,16 L2,2 L16,2 L16,16 L2,16 Z M15,3 L3,3 L3,15 L6.01450559,15.0007546 C6.00487984,14.8350654 6,14.6681026 6,14.5 C6,9.80557963 9.80557963,6 14.5,6 C14.6681026,6 14.8350654,6.00487984 15.0007546,6.01450559 L15,3 Z M21.1207246,10.43219 C21.4057947,11.0006944 21.6221993,11.6022295 21.7647046,12.2262375 L21.841298,12.6032547 L20.8567349,12.7782849 C20.7568253,12.217881 20.5907997,11.6818722 20.3673577,11.1780918 L20.2264721,10.8797536 L21.1207246,10.43219 Z M17.9916771,7.10130899 C18.5424241,7.42254861 19.0528929,7.80842959 19.5119541,8.24980783 L19.7811328,8.5212213 L19.0549764,9.20875111 C18.6719511,8.80365961 18.2414791,8.44480163 17.7730536,8.14072484 L17.4875197,7.96492089 L17.9916771,7.10130899 Z'
          disabled={!canMask} />
        <TopbarButton
          label='Forward'
          onClick={handleMoveForwardClick}
          icon='M11.5,20 L7.62371165,15.5586636 L8.37628835,14.900159 L11.0002883,17.8997074 L11,8.00029613 L4,8 L4,4 L19,4 L19,8 L12,8.00029613 L12.0002883,17.8997074 L14.6237117,14.900159 L15.3762883,15.5586636 L11.5,20 Z M13,13 L13,10 L19,10 L19,13 L13,13 Z M4,13 L4,10 L10,10 L10,13 L4,13 Z'
          disabled={!canMoveForward} />
        <TopbarButton
          label='Backward'
          onClick={handleMoveBackwardClick}
          icon='M11.5,4 L15.3762883,8.44133642 L14.6237117,9.09984103 L11.9997117,6.10029259 L12,15.9997039 L19,16 L19,20 L4,20 L4,16 L11,15.9997039 L10.9997117,6.10029259 L8.37628835,9.09984103 L7.62371165,8.44133642 L11.5,4 Z M10,11 L10,14 L4,14 L4,11 L10,11 Z M19,11 L19,14 L13,14 L13,11 L19,11 Z'
          disabled={!canMoveBackward} />
        <TopbarButton
          label='Group'
          onClick={handleGroupClick}
          icon='M5,2 L5,3 L19,3 L19,2 L22,2 L22,5 L21,5 L21,19 L22,19 L22,22 L19,22 L19,21 L5,21 L5,22 L2,22 L2,19 L3,19 L3,5 L2,5 L2,2 L5,2 Z M19,4 L5,4 L5,5 L4,5 L4,19 L5,19 L5,20 L19,20 L19,19 L20,19 L20,5 L19,5 L19,4 Z M17,10 L17,17 L10,17 L10,10 L17,10 Z M14,7 L14,9 L9,9 L9,14 L7,14 L7,7 L14,7 Z'
          disabled={!canGroup} />
        <TopbarButton
          label='Ungroup'
          onClick={handleUngroupClick}
          icon='M13,11 L13,12 L18,12 L18,11 L20,11 L20,13 L19,13 L19,18 L20,18 L20,20 L18,20 L18,19 L13,19 L13,20 L11,20 L11,18 L12,18 L12,13 L11,13 L11,11 L13,11 Z M6,4 L6,5 L11,5 L11,4 L13,4 L13,6 L12,6 L12,10 L10,10 L10,12 L6,12 L6,13 L4,13 L4,11 L5,11 L5,6 L4,6 L4,4 L6,4 Z'
          disabled={!canUngroup} />
      </div>
      <div className='c-topbar__button-group'>
        <TopbarButton
          label='Tweens'
          onClick={isTweenDrawerOpen ? closeTweenDrawer : openTweenDrawer}
          icon='M20,2 C21.1045695,2 22,2.8954305 22,4 C22,5.1045695 21.1045695,6 20,6 C19.198685,6 18.5074366,5.52874899 18.1882777,4.84826986 C14.5079434,5.67662984 11.6831421,7.17519855 9.70198469,9.33775263 C7.69282622,11.5308716 6.12101186,14.5044994 4.99180281,18.2624097 C5.59467168,18.6083555 6,19.256843 6,20 C6,21.1045695 5.1045695,22 4,22 C2.8954305,22 2,21.1045695 2,20 C2,18.9456382 2.81587779,18.0818349 3.85073766,18.0054857 L4.02725117,18.0001819 C5.19720815,14.0937278 6.8415122,10.9797594 8.96462952,8.66224737 C11.1005861,6.33072053 14.1181111,4.73384315 18.0052695,3.86490437 C18.0736125,2.82366656 18.9406174,2 20,2 Z M4,19 C3.44771525,19 3,19.4477153 3,20 C3,20.5522847 3.44771525,21 4,21 C4.55228475,21 5,20.5522847 5,20 C5,19.4477153 4.55228475,19 4,19 Z M20,3 C19.4477153,3 19,3.44771525 19,4 C19,4.55228475 19.4477153,5 20,5 C20.5522847,5 21,4.55228475 21,4 C21,3.44771525 20.5522847,3 20,3 Z'
          isActive={isTweenDrawerOpen} />
        <TopbarButton
          label='Preview'
          onClick={handlePreviewClick}
          icon='M19.5,12 L6.5,20 L6.5,4.00178956 C6.5,4.00123728 6.50044772,4.00078956 6.501,4.00078956 C6.50118506,4.00078956 6.50136649,4.00084092 6.5015241,4.00093791 L19.5,12 L19.5,12 Z' />
      </div>
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
  const canMoveBackward = selected.length > 0 && !layer.present.selected.some((id: string) => {
    const layer = state.layer.present.byId[id];
    const parent = state.layer.present.byId[layer.parent];
    return parent.children[0] === id;
  });
  const canMoveForward = selected.length > 0 && !layer.present.selected.some((id: string) => {
    const layer = state.layer.present.byId[id];
    const parent = state.layer.present.byId[layer.parent];
    return parent.children[parent.children.length - 1] === id;
  });
  const canGroup = selected.length > 0 && !layer.present.selected.some((id: string) => {
    const layer = state.layer.present.byId[id];
    return layer.type === 'Artboard';
  });
  const canUngroup = selected.length > 0 && layer.present.selected.some((id: string) => {
    const layer = state.layer.present.byId[id];
    return layer.type === 'Group';
  });
  return { tool, activeArtboard, isTweenDrawerOpen, selected, canMask, canMoveBackward, canMoveForward, canGroup, canUngroup };
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
    addLayersMask,
    groupLayers,
    ungroupLayers,
    sendLayersBackward,
    sendLayersForward,
    addImage
  }
)(Topbar);