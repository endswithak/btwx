import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { enableDrawTool, disableDrawTool } from '../store/actions/drawTool';
import { ThemeContext } from './ThemeProvider';

interface TopbarStateProps {
  disableDrawTool(): any;
  enableDrawTool(payload: {drawShapeType: em.ShapeType}): any;
}

const Topbar = (state: TopbarStateProps): ReactElement => {
  const [drawShapeType, setDrawShapeType] = useState(null);
  const theme = useContext(ThemeContext);
  const { enableDrawTool, disableDrawTool } = state;

  const handleDrawClick = (shape: em.ShapeType) => {
    if (drawShapeType === shape) {
      disableDrawTool();
    } else {
      setDrawShapeType(shape);
      enableDrawTool({
        drawShapeType: shape
      });
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

export default connect(
  null,
  { enableDrawTool, disableDrawTool }
)(Topbar);