import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { enableSelectionTool, enableRectangleDrawTool, enableEllipseDrawTool, enableStarDrawTool, enablePolygonDrawTool, enableRoundedDrawTool, enableArtboardTool, enableTextTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { openTweenDrawer, closeTweenDrawer } from '../store/actions/tweenDrawer';
import { TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { ThemeContext } from './ThemeProvider';
import { ipcRenderer } from 'electron';
import TopbarButton from './TopbarButton';

interface TopbarStateProps {
  drawShapeType: em.ShapeType;
  activeArtboard: em.Artboard;
  isTweenDrawerOpen: boolean;
  typing: boolean;
  enableRectangleDrawTool(): ToolTypes;
  enableEllipseDrawTool(): ToolTypes;
  enableStarDrawTool(): ToolTypes;
  enablePolygonDrawTool(): ToolTypes;
  enableRoundedDrawTool(): ToolTypes;
  enableSelectionTool(): ToolTypes;
  enableArtboardTool(): ToolTypes;
  enableTextTool(): ToolTypes;
  openTweenDrawer(): TweenDrawerTypes;
  closeTweenDrawer(): TweenDrawerTypes;
}

const Topbar = (props: TopbarStateProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const {
    isTweenDrawerOpen,
    enableRectangleDrawTool,
    enableEllipseDrawTool,
    enableSelectionTool,
    enableStarDrawTool,
    drawShapeType,
    enablePolygonDrawTool,
    enableRoundedDrawTool,
    enableArtboardTool,
    activeArtboard,
    enableTextTool,
    openTweenDrawer,
    closeTweenDrawer,
    typing,
  } = props;

  const handleDrawClick = (shape: em.ShapeType | 'Artboard') => {
    if (drawShapeType === shape) {
      enableSelectionTool();
    } else {
      switch(shape) {
        case 'Artboard':
          enableArtboardTool();
          break;
        case 'Rectangle':
          enableRectangleDrawTool();
          break;
        case 'Ellipse':
          enableEllipseDrawTool();
          break;
        case 'Star':
          enableStarDrawTool();
          break;
        case 'Polygon':
          enablePolygonDrawTool();
          break;
        case 'Rounded':
          enableRoundedDrawTool();
          break;
      }
    }
  }

  const handlePreviewClick = () => {
    ipcRenderer.send('openPreview', JSON.stringify(activeArtboard));
  }

  const handleTweenDrawerClick = () => {
    if (isTweenDrawerOpen) {
      closeTweenDrawer();
    } else {
      openTweenDrawer();
    }
  }

  const handleTextClick = () => {
    if (typing) {
      enableSelectionTool();
    } else {
      enableTextTool();
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
        onClick={() => handleDrawClick('Artboard')}
        icon='M14,3 L14,4 L21,4 L21,15 L22,15 L22,16 L18,16 L18,21 L17,21 L17,18 L7,18 L7,21 L6,21 L6,16 L2,16 L2,15 L3,15 L3,4 L10,4 L10,3 L14,3 Z M17,16 L7,16 L7,17 L17,17 L17,16 Z'
        isActive={drawShapeType === 'Artboard'} />
      <TopbarButton
        onClick={() => handleDrawClick('Rectangle')}
        icon='M4,4 L19.999,4 C19.9995523,4 20,4.00044772 20,4.001 L20,20 L20,20 L4,20 L4,4 Z'
        isActive={drawShapeType === 'Rectangle'} />
      <TopbarButton
        onClick={() => handleDrawClick('Rounded')}
        icon='M7.55555556,4 L16.4444444,4 C18.4081236,4 20,5.59187645 20,7.55555556 L20,16.4444444 C20,18.4081236 18.4081236,20 16.4444444,20 L7.55555556,20 C5.59187645,20 4,18.4081236 4,16.4444444 L4,7.55555556 C4,5.59187645 5.59187645,4 7.55555556,4 Z'
        isActive={drawShapeType === 'Rounded'} />
      <TopbarButton
        onClick={() => handleDrawClick('Ellipse')}
        icon='M12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 Z'
        isActive={drawShapeType === 'Ellipse'} />
      <TopbarButton
        onClick={() => handleDrawClick('Star')}
        icon='M12,17.2668737 L7.05572809,20 L8,14.2111456 L4,10.1114562 L9.52786405,9.26687371 L11.9990948,4.00192861 C11.9993294,4.00142866 11.9999249,4.0012136 12.0004249,4.00144827 C12.0006362,4.00154743 12.0008061,4.00171735 12.0009052,4.00192861 L14.472136,9.26687371 L14.472136,9.26687371 L20,10.1114562 L16,14.2111456 L16.9442719,20 L12,17.2668737 Z'
        isActive={drawShapeType === 'Star'} />
      <TopbarButton
        onClick={() => handleDrawClick('Polygon')}
        icon='M12.0006071,4.00046375 L19.9994457,10.1110327 C19.9997787,10.1112871 19.9999178,10.1117222 19.9997941,10.1121226 L16.9444897,19.9992952 C16.9443602,19.9997142 16.9439728,20 16.9435343,20 L7.05646573,20 C7.05602717,20 7.05563979,19.9997142 7.05551031,19.9992952 L4.00020594,10.1121226 C4.00008221,10.1117222 4.00022128,10.1112871 4.0005543,10.1110327 L11.9993929,4.00046375 C11.9997513,4.00018996 12.0002487,4.00018996 12.0006071,4.00046375 Z'
        isActive={drawShapeType === 'Polygon'} />
      <TopbarButton
        onClick={handleTextClick}
        icon='M12.84,18.999 L12.84,6.56 L12.84,6.56 L16.92,6.56 L16.92,5 L7.08,5 L7.08,6.56 L11.16,6.56 L11.16,19 L12.839,19 C12.8395523,19 12.84,18.9995523 12.84,18.999 Z'
        isActive={typing} />
      <TopbarButton
        onClick={handlePreviewClick}
        icon='M19.5,12 L6.5,20 L6.5,4.00178956 C6.5,4.00123728 6.50044772,4.00078956 6.501,4.00078956 C6.50118506,4.00078956 6.50136649,4.00084092 6.5015241,4.00093791 L19.5,12 L19.5,12 Z' />
      <TopbarButton
        onClick={handleTweenDrawerClick}
        icon='M15,16 L15,20 L3,20 L3,16 L15,16 Z M21,16 L21,20 L17,20 L17,16 L21,16 Z M15,10 L15,14 L11,14 L11,10 L15,10 Z M9,10 L9,14 L3,14 L3,10 L9,10 Z M15,4 L15,8 L3,8 L3,4.001 C3,4.00044772 3.00044772,4 3.001,4 L15,4 L15,4 Z M21,4 L21,8 L17,8 L17,4 L21,4 Z'
        isActive={isTweenDrawerOpen} />
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { tool, layer, tweenDrawer } = state;
  const drawShapeType = tool.drawShape;
  const activeArtboard = layer.present.byId[layer.present.activeArtboard];
  const isTweenDrawerOpen = tweenDrawer.isOpen;
  const typing = tool.typing;
  return { drawShapeType, activeArtboard, isTweenDrawerOpen, typing };
};

export default connect(
  mapStateToProps,
  {
    enableRectangleDrawTool,
    enableEllipseDrawTool,
    enableStarDrawTool,
    enablePolygonDrawTool,
    enableRoundedDrawTool,
    enableSelectionTool,
    enableArtboardTool,
    enableTextTool,
    openTweenDrawer,
    closeTweenDrawer
  }
)(Topbar);