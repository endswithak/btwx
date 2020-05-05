import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { enableSelectionTool, enableRectangleDrawTool, enableEllipseDrawTool, enableStarDrawTool, enablePolygonDrawTool, enableRoundedDrawTool, enableArtboardTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { ThemeContext } from './ThemeProvider';

interface TopbarStateProps {
  drawShapeType: em.ShapeType;
  enableRectangleDrawTool(): ToolTypes;
  enableEllipseDrawTool(): ToolTypes;
  enableStarDrawTool(): ToolTypes;
  enablePolygonDrawTool(): ToolTypes;
  enableRoundedDrawTool(): ToolTypes;
  enableSelectionTool(): ToolTypes;
  enableArtboardTool(): ToolTypes;
}

const Topbar = (props: TopbarStateProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { enableRectangleDrawTool, enableEllipseDrawTool, enableSelectionTool, enableStarDrawTool, drawShapeType, enablePolygonDrawTool, enableRoundedDrawTool, enableArtboardTool } = props;

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

  return (
    <div
      className='c-topbar'
      style={{
        background: theme.background.z3
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
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { tool } = state;
  const drawShapeType = tool.drawShape;
  return { drawShapeType };
};

export default connect(
  mapStateToProps,
  { enableRectangleDrawTool, enableEllipseDrawTool, enableStarDrawTool, enablePolygonDrawTool, enableRoundedDrawTool, enableSelectionTool, enableArtboardTool }
)(Topbar);