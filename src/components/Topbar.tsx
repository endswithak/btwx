import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { enableSelectionTool, enableRectangleDrawTool, enableEllipseDrawTool, enableStarDrawTool, enablePolygonDrawTool, enableRoundedDrawTool, enableArtboardTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { openTweenDrawer, closeTweenDrawer } from '../store/actions/tweenDrawer';
import { AnimationDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { ThemeContext } from './ThemeProvider';
import { ipcRenderer } from 'electron';

interface TopbarStateProps {
  drawShapeType: em.ShapeType;
  activeArtboard: em.Artboard;
  isTweenDrawerOpen: boolean;
  enableRectangleDrawTool(): ToolTypes;
  enableEllipseDrawTool(): ToolTypes;
  enableStarDrawTool(): ToolTypes;
  enablePolygonDrawTool(): ToolTypes;
  enableRoundedDrawTool(): ToolTypes;
  enableSelectionTool(): ToolTypes;
  enableArtboardTool(): ToolTypes;
  openTweenDrawer(): AnimationDrawerTypes;
  closeTweenDrawer(): AnimationDrawerTypes;
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
    openTweenDrawer,
    closeTweenDrawer
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

  return (
    <div
      className='c-topbar'
      style={{
        background: theme.background.z1,
        boxShadow: `0 -1px 0 0 ${theme.background.z3} inset`
      }}>
      <button
        className='c-topbar__button'
        onClick={() => handleDrawClick('Artboard')}>
        A
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleDrawClick('Rectangle')}>
        R
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleDrawClick('Rounded')}>
        D
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleDrawClick('Ellipse')}>
        E
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleDrawClick('Star')}>
        S
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleDrawClick('Polygon')}>
        P
      </button>
      <button
        className='c-topbar__button'
        onClick={handlePreviewClick}
        style={{
          background: 'green'
        }}>
        P
      </button>
      <button
        className='c-topbar__button'
        onClick={handleTweenDrawerClick}
        style={{
          background: 'yellow'
        }}>
        A
      </button>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { tool, layer, tweenDrawer } = state;
  const drawShapeType = tool.drawShape;
  const activeArtboard = layer.present.byId[layer.present.activeArtboard];
  const isTweenDrawerOpen = tweenDrawer.isOpen;
  return { drawShapeType, activeArtboard, isTweenDrawerOpen };
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
    openTweenDrawer,
    closeTweenDrawer
  }
)(Topbar);