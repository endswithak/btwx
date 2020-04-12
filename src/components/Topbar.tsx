import React, { useContext, ReactElement, useEffect } from 'react';
import { store } from '../store';

const Topbar = (): ReactElement => {
  const globalState = useContext(store);
  const { theme, dispatch, paperApp, drawShape } = globalState;

  const handleDrawClick = (shape: em.ShapeType) => {
    if (drawShape === shape) {
      dispatch({
        type: 'disable-draw-tool'
      });
    } else {
      dispatch({
        type: 'enable-draw-tool',
        shape: shape
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
        onClick={() => handleDrawClick('rectangle')}>
        R
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleDrawClick('rounded')}>
        D
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleDrawClick('ellipse')}>
        E
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleDrawClick('star')}>
        S
      </button>
      <button
        className='c-topbar__button'
        onClick={() => handleDrawClick('polygon')}>
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

export default Topbar;