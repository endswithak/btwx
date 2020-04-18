import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarInput from './SidebarInput';
import SidebarSectionColumn from './SidebarSectionColumn';

const WidthInput = (): ReactElement => {
  const globalState = useContext(store);
  const [width, setWidth] = useState<string | number>(0);
  const { selection } = globalState;

  const getWidth = () => {
    switch(selection.length) {
      case 0:
        return '';
      case 1:
        return Math.round(selection[0].paperItem.bounds.width);
      default:
        return 'multi';
    }
  }

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setWidth(target.value);
  };

  useEffect(() => {
    setWidth(getWidth());
  }, [selection]);

  return (
    <SidebarInput
      value={width}
      onChange={handleChange}
      label={'W'}
      disabled={selection.length > 1 || selection.length === 0} />
  );
}

export default WidthInput;