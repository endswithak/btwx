import React, { useContext, ReactElement, useEffect } from 'react';
import { store } from '../store';

const Topbar = (): ReactElement => {
  const globalState = useContext(store);
  const { theme, dispatch, drawShape, paperApp, drawShapeType } = globalState;

  const handleClick = (shape: em.ShapeType) => {
    if (drawShapeType === shape) {
      dispatch({
        type: 'disable-draw-shape'
      });
      paperApp.drawTool.disable();
    } else {
      dispatch({
        type: 'enable-draw-shape',
        drawShapeType: shape
      });
      paperApp.drawTool.enable(shape);
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
        onClick={() => handleClick('rectangle')}>
        R
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleClick('rounded')}>
        D
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleClick('ellipse')}>
        E
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleClick('star')}>
        S
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleClick('polygon')}>
        P
      </button>
    </div>
  );
}

export default Topbar;