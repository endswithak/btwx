import React, { ReactElement, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const LoadingIndicator = (): ReactElement => {
  const theme = useContext(ThemeContext);
  return (
    <div className='c-loading-indicator'>
      <div
        className='c-loading-indicator__circ c-loading-indicator__circ--inner'
        style={{
          border: `${theme.unit / 2}px solid ${theme.text.lighter}`
        }} />
      <div
        className='c-loading-indicator__circ c-loading-indicator__circ--outer'
        style={{
          border: `${theme.unit / 2}px solid ${theme.text.lighter}`
        }} />
    </div>
  );
}

export default LoadingIndicator;