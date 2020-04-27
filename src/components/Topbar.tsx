import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { enableDrawTool, disableDrawTool } from '../store/actions/drawTool';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/selectionTool';
import { ThemeContext } from './ThemeProvider';

interface TopbarStateProps {
  drawShapeType: em.ShapeType;
  drawing: boolean;
  disableDrawTool(): any;
  enableDrawTool(payload: {drawShapeType: em.ShapeType}): any;
  enableSelectionTool(): any;
  disableSelectionTool(): any;
}

const Topbar = (props: TopbarStateProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { enableDrawTool, disableDrawTool, enableSelectionTool, disableSelectionTool, drawShapeType, drawing } = props;

  const handleDrawClick = (shape: em.ShapeType) => {
    if (drawShapeType === shape) {
      disableDrawTool();
      enableSelectionTool();
    } else {
      if (drawing) {
        disableDrawTool();
        enableDrawTool({
          drawShapeType: shape
        });
      } else {
        disableSelectionTool();
        enableDrawTool({
          drawShapeType: shape
        });
      }
    }
  }

  const handleGroupClick = () => {

  }

  return (
    <div
      className='c-topbar'
      style={{
        background: theme.background.z3
      }}>
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
        className='c-topbar__button c-topbar__button--blue'
        onClick={() => handleGroupClick()}>
        G
      </button>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { drawTool } = state;
  const drawShapeType = drawTool.drawShape;
  const drawing = drawTool.drawing;
  return { drawShapeType, drawing };
};

export default connect(
  mapStateToProps,
  { enableDrawTool, disableDrawTool, enableSelectionTool, disableSelectionTool }
)(Topbar);