import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarInput from './SidebarInput';

const YInput = (): ReactElement => {
  const globalState = useContext(store);
  const [y, setY] = useState(0);
  const { selection } = globalState;

  const getY = () => {
    switch(selection.length) {
      case 0:
        return '';
      case 1:
        return Math.round(selection[0].paperItem.position.y);
      default:
        return 'multi';
    }
  }

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setY(target.value);
  };

  useEffect(() => {
    setY(getY());
  }, [selection]);

  return (
    <SidebarInput
      value={y}
      onChange={handleChange}
      label={'Y'}
      disabled={selection.length > 1 || selection.length === 0} />
  );
}

export default YInput;