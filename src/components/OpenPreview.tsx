import React, { useContext, ReactElement } from 'react';
import { store } from '../store';
import { ipcRenderer } from 'electron';

const OpenPreview = (): ReactElement => {
  const globalState = useContext(store);

  const handleClick = () => {
    ipcRenderer.send('openPreview', 'open');
  };

  return (
    <button
      onClick={handleClick}
      className='c-open-preview'>
      click me
    </button>
  )
}

export default OpenPreview;