import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarInput from './SidebarInput';

const HeightInput = (): ReactElement => {
  const globalState = useContext(store);
  const [height, setHeight] = useState<string | number>(0);
  const { selection } = globalState;

  const getHeight = () => {
    switch(selection.length) {
      case 0:
        return '';
      case 1:
        return Math.round(selection[0].paperItem.bounds.height);
      default:
        return 'multi';
    }
  }

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setHeight(target.value);
  };

  useEffect(() => {
    setHeight(getHeight());
  }, [selection]);

  return (
    <SidebarInput
      value={height}
      onChange={handleChange}
      label={'H'}
      disabled={selection.length > 1 || selection.length === 0} />
  );
}

export default HeightInput;