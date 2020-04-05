import React, { useContext, ReactElement } from 'react';
import { store } from '../store';

const Topbar = (): ReactElement => {
  const globalState = useContext(store);
  const { theme, dispatch, drawing } = globalState;

  const handleClick = (shape: string) => {
    if (!drawing) {
      dispatch({
        type: 'set-drawing',
        drawing: true,
        drawingShape: shape,
      });
    } else {
      dispatch({
        type: 'set-drawing',
        drawing: false,
        drawingShape: null
      });
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